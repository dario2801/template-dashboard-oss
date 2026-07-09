/**
 * @jest-environment node
 */
import { GET, dynamic } from "@/app/api/health/route"
import { siteConfig } from "@/app/siteConfig"

describe("GET /api/health", () => {
  it("reports the live instance as ok", async () => {
    const response = GET()
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.status).toBe("ok")
    expect(body.name).toBe(siteConfig.name)
  })

  it("stamps a valid timestamp on each call", async () => {
    const body = await GET().json()
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false)
  })

  it("never serves a build-time snapshot to an uptime probe", () => {
    expect(dynamic).toBe("force-dynamic")
  })
})
