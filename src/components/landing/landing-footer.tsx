import { siteConfig } from "@/app/siteConfig"
import { BrandLogo } from "@/components/brand/brand-logo"
import Link from "next/link"
import { sectionShell } from "./styles"

const columns = [
  {
    heading: "Product",
    links: [
      { name: "Overview", href: "#product" },
      { name: "Features", href: "#features" },
      { name: "Customers", href: "#customers" },
    ],
  },
  {
    heading: "Account",
    links: [
      { name: "Sign in", href: siteConfig.baseLinks.signIn },
      { name: "Create account", href: siteConfig.baseLinks.signUp },
    ],
  },
  {
    heading: "Support",
    links: [
      {
        name: siteConfig.supportEmail,
        href: `mailto:${siteConfig.supportEmail}`,
      },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="mt-32 border-t border-graphite lg:mt-40">
      <div className={`${sectionShell} py-16`}>
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <BrandLogo className="text-paper-white dark:text-paper-white" />
            <p className="mt-4 max-w-56 text-sm leading-[1.5] text-fog">
              {siteConfig.tagline}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-fog">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-mist transition-colors hover:text-paper-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-16 border-t border-graphite pt-8 text-sm text-steel">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
