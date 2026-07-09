import { siteConfig } from "@/app/siteConfig"
import { BrandLogo } from "@/components/brand/brand-logo"
import { render, screen } from "@testing-library/react"

describe("BrandLogo", () => {
  it("renders the wordmark from the brand config", () => {
    render(<BrandLogo />)
    expect(screen.getByText(siteConfig.name)).toBeInTheDocument()
  })

  it("omits the wordmark in the icon variant", () => {
    render(<BrandLogo variant="icon" />)
    expect(screen.queryByText(siteConfig.name)).not.toBeInTheDocument()
  })

  /**
   * Regression: the wordmark color used to sit on the inner span, where a caller's
   * className could not override it through twMerge. On the landing's black canvas
   * with a light dashboard theme, the name rendered black on black.
   */
  it("lets a caller override the wordmark color", () => {
    const { container } = render(<BrandLogo className="text-paper-white" />)
    const wrapper = container.firstElementChild as HTMLElement

    expect(wrapper).toHaveClass("text-paper-white")
    expect(wrapper).not.toHaveClass("text-gray-900")
  })

  it("keeps its default color when the caller passes none", () => {
    const { container } = render(<BrandLogo />)
    expect(container.firstElementChild).toHaveClass("text-gray-900")
  })
})
