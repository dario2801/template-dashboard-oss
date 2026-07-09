import { Cta } from "@/components/landing/cta"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { Stats } from "@/components/landing/stats"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <Stats />
        <Cta />
      </main>
      <LandingFooter />
    </div>
  )
}
