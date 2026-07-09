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
          <p className="text-fog text-[13px] font-medium tracking-[-0.02em]">
            Analytics for teams that ship
          </p>
          <h1 className="font-display text-paper-white mt-5 text-[52px] font-normal leading-[1.05] tracking-[0.01em] lg:text-[64px] xl:text-[76px]">
            {siteConfig.tagline}
          </h1>
          <p className="text-bone mt-6 max-w-md text-base leading-[1.5]">
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

          <p className="text-steel mt-5 text-sm">
            No credit card required. Free while you evaluate.
          </p>
        </div>

        <div className="border-graphite bg-carbon rounded-[10px] border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-fog text-sm">Revenue this quarter</p>
              <p className="text-paper-white mt-2 text-5xl font-medium tracking-[-0.025em]">
                $482,190
              </p>
            </div>
            <span className={tagPill}>Last 90 days</span>
          </div>

          <div className="mt-8">
            <RevenueChart />
          </div>

          <dl className="border-graphite mt-8 grid grid-cols-3 border-t pt-5">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-fog text-[13px]">{metric.label}</dt>
                <dd className="text-bone mt-1 text-[15px]">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
