import {
  formatters,
  millionFormatter,
  percentageFormatter,
  usNumberformatter,
} from "@/lib/utils"

/**
 * These formatters run on the server during SSR and again in the browser during
 * hydration. If either side reads the runtime's default locale, the two renders
 * disagree on the separators and React throws away the server HTML.
 *
 * A locale-dependent formatter still passes these assertions on a machine whose
 * default locale happens to be en-US, so this suite catches the regression only
 * where the bug is observable: a runtime configured for any other locale.
 */
describe("number formatters are locale independent", () => {
  it("groups thousands the en-US way, whatever the runtime locale is", () => {
    expect(usNumberformatter(1234567)).toBe("1,234,567")
    expect(usNumberformatter(3093)).toBe("3,093")
  })

  it("keeps the requested precision", () => {
    expect(usNumberformatter(1234.5678, 2)).toBe("1,234.57")
  })

  it("renders currency with a leading dollar sign and a decimal point", () => {
    expect(formatters.currency(293.5)).toBe("$293.50")
  })

  it("routes the unit formatter through the same en-US grouping", () => {
    expect(formatters.unit(1234567)).toBe("1,234,567")
  })

  it("signs positive percentages and uses a decimal point", () => {
    expect(percentageFormatter(0.217)).toBe("+21.7%")
    expect(percentageFormatter(-0.014)).toBe("-1.4%")
  })

  it("renders millions with a decimal point", () => {
    expect(millionFormatter(1.5)).toBe("1.5M")
  })
})
