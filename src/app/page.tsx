import { Cta } from "@/components/landing/cta"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { Stats } from "@/components/landing/stats"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <a
        href="#main-content"
        className="sr-only rounded-full bg-paper-white px-5 py-2.5 text-sm font-medium text-black focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <LandingHeader />
      <main id="main-content">
        <Hero />
        <Features />
        <DashboardPreview />
        <Stats />
        <Cta />
      </main>
      <LandingFooter />
    </div>
  )
}
