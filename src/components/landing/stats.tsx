import { gildedFigure, sectionShell } from "./styles"

const stats = [
  { value: "10,000+", label: "teams tracking metrics" },
  { value: "40ms", label: "median query latency" },
  { value: "99.98%", label: "dashboard uptime" },
]

export function Stats() {
  return (
    <section id="customers" className={`${sectionShell} pt-32 lg:pt-40`}>
      <div className="border-graphite grid gap-12 border-y py-16 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              className={`font-display text-[44px] font-normal leading-none tracking-[0.01em] ${gildedFigure}`}
            >
              {stat.value}
            </p>
            <p className="text-fog mt-4 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
