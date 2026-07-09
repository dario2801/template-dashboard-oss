import { siteConfig } from "@/app/siteConfig"
import { Show } from "@clerk/nextjs"
import Link from "next/link"
import { RevenueChart } from "./revenue-chart"
import { ghostPill, primaryPill, sectionShell, tagPill } from "./styles"

const metrics = [
  { label: "Active users", value: "8,240" },
  { label: "Conversion", value: "4.7%" },
  { label: "Churn", value: "0.9%" },
]

export function Hero() {
  return (
    <section id="product" className={`${sectionShell} pt-20 lg:pt-28`}>
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="text-[13px] font-medium tracking-[-0.02em] text-fog">
            Analytics for teams that ship
          </p>
          <h1 className="mt-5 font-display text-[52px] font-normal leading-[1.05] tracking-[0.01em] text-paper-white lg:text-[64px] xl:text-[76px]">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-md text-base leading-[1.5] text-bone">
            {siteConfig.description} Connect a source, pick your metrics, and
            share a dashboard your whole team can read at a glance.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Show
              when="signed-in"
              fallback={
                <>
                  <Link
                    href={siteConfig.baseLinks.signUp}
                    className={primaryPill}
                  >
                    Get started free
                  </Link>
                  <Link
                    href={siteConfig.baseLinks.signIn}
                    className={ghostPill}
                  >
                    Sign in
                  </Link>
                </>
              }
            >
              <Link
                href={siteConfig.baseLinks.overview}
                className={primaryPill}
              >
                Open your dashboard
              </Link>
            </Show>
          </div>

          <p className="mt-5 text-sm text-steel">
            No credit card required. Free while you evaluate.
          </p>
        </div>

        <div className="rounded-[10px] border border-graphite bg-onyx p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-fog">Revenue this quarter</p>
              <p className="mt-2 text-5xl font-medium tracking-[-0.025em] text-paper-white">
                $482,190
              </p>
            </div>
            <span className={tagPill}>Last 90 days</span>
          </div>

          <div className="mt-8">
            <RevenueChart />
          </div>

          <dl className="mt-8 grid grid-cols-3 border-t border-graphite pt-5">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-[13px] text-fog">{metric.label}</dt>
                <dd className="mt-1 text-[15px] text-bone">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
