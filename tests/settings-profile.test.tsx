import Settings from "@/app/(main)/settings/page"
import { siteConfig } from "@/app/siteConfig"
import { render, screen } from "@testing-library/react"

const useUser = jest.fn()
jest.mock("@clerk/nextjs", () => ({
  useUser: () => useUser(),
}))

function signedInAs(fullName: string | null, email: string) {
  useUser.mockReturnValue({
    isLoaded: true,
    user: {
      fullName,
      primaryEmailAddress: { emailAddress: email },
    },
  })
}

describe("settings profile", () => {
  afterEach(() => useUser.mockReset())

  /**
   * Regression: the profile section rendered siteConfig.sampleUser, so every signed-in
   * user saw the demo identity instead of their own account.
   */
  it("shows the signed-in user, not the demo identity", () => {
    signedInAs("Ada Lovelace", "ada@example.com")
    render(<Settings />)

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
    expect(screen.getByText("ada@example.com")).toBeInTheDocument()
    expect(screen.queryByText(siteConfig.sampleUser.name)).not.toBeInTheDocument()
    expect(
      screen.queryByText(siteConfig.sampleUser.email),
    ).not.toBeInTheDocument()
  })

  it("fills the read-only fields from the session", () => {
    signedInAs("Ada Lovelace", "ada@example.com")
    render(<Settings />)

    expect(screen.getByLabelText("Full name")).toHaveValue("Ada Lovelace")
    expect(screen.getByLabelText("Email")).toHaveValue("ada@example.com")
  })

  it("derives the avatar initials from the signed-in name", () => {
    signedInAs("Ada Lovelace", "ada@example.com")
    render(<Settings />)
    expect(screen.getByText("AL")).toBeInTheDocument()
  })

  it("falls back to the email when the account carries no name", () => {
    signedInAs(null, "ada@example.com")
    render(<Settings />)
    expect(screen.getByLabelText("Full name")).toHaveValue("ada@example.com")
  })

  it("labels the workspace with the brand, never with the user", () => {
    signedInAs("Ada Lovelace", "ada@example.com")
    render(<Settings />)

    expect(screen.getByText(siteConfig.name)).toBeInTheDocument()
    // "AL" belongs to the user avatar; the workspace tile must read "NA".
    expect(screen.getByText("NA")).toBeInTheDocument()
  })

  it("renders no stale identity while the session is still loading", () => {
    useUser.mockReturnValue({ isLoaded: false, user: null })
    render(<Settings />)

    expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument()
    expect(
      screen.queryByText(siteConfig.sampleUser.email),
    ).not.toBeInTheDocument()
  })
})
