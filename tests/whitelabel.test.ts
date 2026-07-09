import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const ROOT = process.cwd()
const SRC = join(ROOT, "src")

/**
 * Apache 2.0 requires keeping the upstream attribution. These are code-origin
 * markers, not visible UI, so the sweep must not flag them.
 */
const ATTRIBUTION_ALLOWED = [
  /^\s*\/\/\s*Tremor/i,
  /tremor-id="tremor-raw"/i,
]

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const sourceFiles = walk(SRC).filter((f) => /\.(ts|tsx)$/.test(f))

describe("whitelabel sweep", () => {
  it("finds source files to scan", () => {
    expect(sourceFiles.length).toBeGreaterThan(20)
  })

  // Each entry is a trace of the original product that must never reach the UI.
  const forbidden = [
    "retail analytics",
    "database logo",
    "yourname",
    "yoururl.com",
    "emma stone",
    "acme.com",
    "@tremorlabs",
    "blocks.tremor",
    "get full template",
    "tremorplaceholder",
    "template-dashboard-oss",
  ]

  it.each(forbidden)("has no trace of %s in src/", (needle) => {
    const hits = sourceFiles.filter((file) =>
      readFileSync(file, "utf8").toLowerCase().includes(needle),
    )
    expect(hits.map((f) => relative(ROOT, f))).toEqual([])
  })

  it("only mentions the upstream project as code attribution", () => {
    const offenders: string[] = []

    for (const file of sourceFiles) {
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, index) => {
          if (!/tremor/i.test(line)) return
          if (ATTRIBUTION_ALLOWED.some((allowed) => allowed.test(line))) return
          offenders.push(`${relative(ROOT, file)}:${index + 1}`)
        })
    }

    expect(offenders).toEqual([])
  })

  it("never hardcodes the pre-brand accent color", () => {
    const offenders = sourceFiles.filter((file) => {
      const body = readFileSync(file, "utf8")
      return /\bindigo-\d/.test(body) || /#6366F1/i.test(body)
    })
    expect(offenders.map((f) => relative(ROOT, f))).toEqual([])
  })

  it("removed the template assets and placeholder icon", () => {
    const gone = [
      "src/app/favicon.ico",
      "src/app/opengraph-image.png",
      "public/og_github.jpg",
      "src/components/ui/icons/TremorPlaceholder.tsx",
      "public/DatabaseLogo.tsx",
    ]
    const survivors = gone.filter((p) => existsSync(join(ROOT, p.split("/").join(sep))))
    expect(survivors).toEqual([])
  })

  it("ships the Nova favicon and a generated Open Graph image", () => {
    expect(existsSync(join(ROOT, "src", "app", "icon.svg"))).toBe(true)
    expect(existsSync(join(ROOT, "src", "app", "opengraph-image.tsx"))).toBe(true)
  })

  it("keeps no em-dash in product copy", () => {
    const offenders = sourceFiles.filter((file) =>
      readFileSync(file, "utf8").includes("—"),
    )
    expect(offenders.map((f) => relative(ROOT, f))).toEqual([])
  })
})
