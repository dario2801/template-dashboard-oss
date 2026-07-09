import { sectionShell } from "./styles"

const stats = [
  { value: "10,000+", label: "teams tracking metrics" },
  { value: "40ms", label: "median query latency" },
  { value: "99.98%", label: "dashboard uptime" },
]

export function Stats() {
  return (
    <section id="customers" className={`${sectionShell} pt-32 lg:pt-40`}>
      <div className="grid gap-12 border-y border-graphite py-16 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-[44px] font-normal leading-none tracking-[0.01em] text-paper-white">
              {stat.value}
            </p>
            <p className="mt-4 text-sm text-fog">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
