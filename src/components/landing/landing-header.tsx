"use client"

import { siteConfig } from "@/app/siteConfig"
import { BrandLogo } from "@/components/brand/brand-logo"
import { Show } from "@clerk/nextjs"
import Link from "next/link"
import { useState } from "react"
import { ghostPill, sectionShell } from "./styles"

const navLinks = [
  { name: "Product", href: "#product" },
  { name: "Features", href: "#features" },
  { name: "Customers", href: "#customers" },
]

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-graphite bg-obsidian/80 backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape") setMenuOpen(false)
      }}
    >
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

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="-mr-1 rounded-sm p-1.5 text-fog transition-colors hover:text-paper-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper-white md:hidden"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
              className="h-5 w-5"
            >
              {menuOpen ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6h14M3 14h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-graphite bg-obsidian md:hidden"
        >
          <ul className={`${sectionShell} py-2`}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm py-2.5 text-sm text-fog transition-colors hover:text-paper-white"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
