import { siteConfig } from "@/app/siteConfig"

describe("brand single source of truth", () => {
  it("names the product Nova Analytics", () => {
    expect(siteConfig.name).toBe("Nova Analytics")
  })

  it("points metadataBase at the live deployment over https", () => {
    expect(() => new URL(siteConfig.url)).not.toThrow()
    expect(new URL(siteConfig.url).protocol).toBe("https:")
    expect(siteConfig.url).not.toMatch(/yoururl|localhost|example\.com/)
  })

  it("uses Nova addresses for support and the sample user", () => {
    expect(siteConfig.supportEmail).toBe("hello@novaanalytics.io")
    expect(siteConfig.sampleUser.email).toBe("admin@novaanalytics.io")
  })

  it("derives the sample user initials from the sample user name", () => {
    const expected = siteConfig.sampleUser.name
      .split(" ")
      .map((part) => part[0])
      .join("")
    expect(siteConfig.sampleUser.initials).toBe(expected)
  })

  it("routes auth and dashboard through known paths", () => {
    expect(siteConfig.baseLinks).toMatchObject({
      home: "/",
      overview: "/overview",
      signIn: "/sign-in",
      signUp: "/sign-up",
    })
  })

  it("dropped the template paywall link", () => {
    expect(siteConfig).not.toHaveProperty("externalLink")
  })

  it("keeps the em-dash out of brand copy", () => {
    const copy = [
      siteConfig.name,
      siteConfig.tagline,
      siteConfig.description,
    ].join(" ")
    expect(copy).not.toContain("—")
  })
})
