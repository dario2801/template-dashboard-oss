import { siteConfig } from "@/app/siteConfig"
import { Cta } from "@/components/landing/cta"
import { Hero } from "@/components/landing/hero"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { render, screen, within } from "@testing-library/react"
import type { ReactNode } from "react"

/**
 * Clerk's <Show> is an async server component. Standing in for it lets these tests
 * assert the signed-out branch, which is what an anonymous visitor actually sees.
 */
jest.mock("@clerk/nextjs", () => ({
  Show: ({
    when,
    fallback,
    children,
  }: {
    when: string
    fallback: ReactNode
    children: ReactNode
  }) => (when === "signed-in" ? fallback : children),
}))

function hrefsIn(container: HTMLElement) {
  return Array.from(container.querySelectorAll("a")).map((a) =>
    a.getAttribute("href"),
  )
}

describe("landing page, signed out", () => {
  it("offers the header a way to sign in and to sign up", () => {
    const { container } = render(<LandingHeader />)
    const hrefs = hrefsIn(container)

    expect(hrefs).toContain(siteConfig.baseLinks.signIn)
    expect(hrefs).toContain(siteConfig.baseLinks.signUp)
    expect(hrefs).not.toContain(siteConfig.baseLinks.overview)
  })

  it("leads the hero with the brand tagline", () => {
    render(<Hero />)
    expect(
      screen.getByRole("heading", { level: 1, name: siteConfig.tagline }),
    ).toBeInTheDocument()
  })

  it("sends both hero calls to action to the auth routes", () => {
    const { container } = render(<Hero />)
    const hrefs = hrefsIn(container)

    expect(hrefs).toContain(siteConfig.baseLinks.signUp)
    expect(hrefs).toContain(siteConfig.baseLinks.signIn)
  })

  /**
   * The design reference calls the white filled pill a scarce resource: at most one
   * per viewport. The hero owns it, so the header must fall back to the ghost pill.
   */
  it("spends the white pill exactly once in the hero", () => {
    const { container } = render(<Hero />)
    const filled = container.querySelectorAll("a.bg-paper-white")
    expect(filled).toHaveLength(1)
  })

  it("never spends the white pill in the header", () => {
    const { container } = render(<LandingHeader />)
    expect(container.querySelectorAll("a.bg-paper-white")).toHaveLength(0)
  })

  it("closes with a single call to action pointing at sign-up", () => {
    const { container } = render(<Cta />)
    expect(hrefsIn(container)).toEqual([siteConfig.baseLinks.signUp])
  })

  it("renders exactly one data visualization, the hero sparkline", () => {
    const { container } = render(<Hero />)
    expect(container.querySelectorAll("svg polyline")).toHaveLength(1)
  })
})

describe("landing footer", () => {
  it("credits Nova Analytics and no other product", () => {
    const { container } = render(<LandingFooter />)
    const credits = screen.getByText(/all rights reserved/i)

    expect(credits.textContent).toContain(siteConfig.name)
    expect(credits.textContent).toContain(String(new Date().getFullYear()))
    expect(container.textContent?.toLowerCase()).not.toContain("tremor")
  })

  it("routes support at the Nova support address", () => {
    const { container } = render(<LandingFooter />)
    expect(hrefsIn(container)).toContain(`mailto:${siteConfig.supportEmail}`)
  })
})

describe("landing copy", () => {
  it("carries no em-dash", () => {
    const { container } = render(
      <>
        <LandingHeader />
        <Hero />
        <Cta />
        <LandingFooter />
      </>,
    )
    expect(container.textContent).not.toContain("—")
  })

  it("labels the hero chart for screen readers", () => {
    const { container } = render(<Hero />)
    const chart = within(container).getByRole("img")
    expect(chart).toHaveAccessibleName()
  })
})
