import { siteConfig } from "@/app/siteConfig"
import { invitedUsers, users } from "@/data/data"

describe("demo dataset", () => {
  const everyEmail = [...users, ...invitedUsers].map((u) => u.email)

  it("leads with the sample user the brief hands to the reviewer", () => {
    expect(users[0].email).toBe(siteConfig.sampleUser.email)
    expect(users[0].role).toBe("admin")
  })

  it("puts every identity on the Nova domain", () => {
    for (const email of everyEmail) {
      expect(email).toMatch(/@novaanalytics\.io$/)
    }
  })

  it("gives every identity a unique email", () => {
    // The upstream dataset reused a.stone@gmail.com across two different users,
    // which also made the address unusable as a React key.
    expect(new Set(everyEmail).size).toBe(everyEmail.length)
  })

  it("matches every set of initials to its name", () => {
    for (const user of users) {
      const expected = user.name
        .split(" ")
        .map((part) => part[0].toUpperCase())
        .join("")
      expect(user.initials).toBe(expected)
    }
  })

  it("leaks no address from the original demo data", () => {
    for (const email of everyEmail) {
      expect(email).not.toMatch(/gmail\.com|acme\.com|bluewin\.ch/)
    }
  })
})
