import {
  AvailableChartColors,
  chartColors,
  constructCategoryColors,
  getColorClassName,
} from "@/lib/chartUtils"

/**
 * `chartColors` keys are a public API: DashboardChartCard passes them as strings.
 * `getColorClassName` silently falls back to gray on an unknown key, so a rename
 * that misses a call site produces a gray chart with a clean build. Guard it.
 */
describe("chart color contract", () => {
  it("exposes brand as a key, not the pre-brand accent", () => {
    expect(Object.keys(chartColors)).toContain("brand")
    expect(Object.keys(chartColors)).not.toContain("indigo")
  })

  it("keeps brand first so the primary series lands on the accent", () => {
    expect(AvailableChartColors[0]).toBe("brand")
  })

  it("points every brand utility at the brand token", () => {
    for (const className of Object.values(chartColors.brand)) {
      expect(className).toMatch(/brand-\d{3}/)
      expect(className).not.toMatch(/indigo/)
    }
  })

  it("resolves the brand key rather than falling back to gray", () => {
    expect(getColorClassName("brand", "bg")).toBe("bg-brand-600 dark:bg-brand-500")
  })

  it("falls back to gray for an unknown key", () => {
    // Reproduces the exact failure a missed call site would cause.
    const stale = "indigo" as unknown as keyof typeof chartColors
    expect(getColorClassName(stale, "stroke")).toBe("stroke-gray-500")
  })

  it("assigns the first category to the brand color", () => {
    const colors = constructCategoryColors(
      ["Revenue", "Costs"],
      ["brand", "gray"],
    )
    expect(colors.get("Revenue")).toBe("brand")
    expect(colors.get("Costs")).toBe("gray")
  })
})
