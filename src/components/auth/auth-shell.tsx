import { siteConfig } from "@/app/siteConfig"
import { BrandLogo } from "@/components/brand/brand-logo"
import Link from "next/link"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 py-16">
      <Link href={siteConfig.baseLinks.home} aria-label={siteConfig.name}>
        <BrandLogo className="text-paper-white dark:text-paper-white" />
      </Link>
      <p className="mt-4 text-center text-sm text-fog">{siteConfig.tagline}</p>
      <div className="mt-10 w-full max-w-[400px]">{children}</div>
    </div>
  )
}
