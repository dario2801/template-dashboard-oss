import { siteConfig } from "@/app/siteConfig"
import { BrandLogo } from "@/components/brand/brand-logo"
import { Show } from "@clerk/nextjs"
import Link from "next/link"
import { ghostPill, sectionShell } from "./styles"

const navLinks = [
  { name: "Product", href: "#product" },
  { name: "Features", href: "#features" },
  { name: "Customers", href: "#customers" },
]

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-graphite bg-obsidian/80 backdrop-blur">
      <div className={`${sectionShell} flex h-16 items-center justify-between`}>
        <Link href={siteConfig.baseLinks.home} aria-label={siteConfig.name}>
          <BrandLogo className="text-paper-white dark:text-paper-white" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="rounded-sm px-2.5 py-1.5 text-sm text-fog transition-colors hover:text-paper-white"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Show
            when="signed-in"
            fallback={
              <>
                <Link
                  href={siteConfig.baseLinks.signIn}
                  className="hidden text-sm text-fog transition-colors hover:text-paper-white sm:block"
                >
                  Sign in
                </Link>
                <Link href={siteConfig.baseLinks.signUp} className={ghostPill}>
                  Get started
                </Link>
              </>
            }
          >
            <Link href={siteConfig.baseLinks.overview} className={ghostPill}>
              Go to dashboard
            </Link>
          </Show>
        </div>
      </div>
    </header>
  )
}
