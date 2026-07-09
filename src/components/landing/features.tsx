import { eyebrow, sectionShell } from "./styles"

const features = [
  {
    category: "Sources",
    title: "Connect what you already use",
    body: "Warehouses, product events, and billing in one place. No pipeline to babysit, no schema to redesign.",
  },
  {
    category: "Metrics",
    title: "Define a number once",
    body: "Metrics live in one definition your team can read and review. Every chart, alert, and export reads from it.",
  },
  {
    category: "Sharing",
    title: "Dashboards people actually open",
    body: "Readable at a glance on any screen. Share a link, set the access, and skip the weekly export ritual.",
  },
]

export function Features() {
  return (
    <section id="features" className={`${sectionShell} pt-32 lg:pt-40`}>
      <div className="max-w-2xl">
        <p className={eyebrow}>Why Nova</p>
        <h2 className="mt-4 font-display text-[40px] font-normal leading-[1.15] tracking-[0.01em] text-paper-white lg:text-[52px]">
          The clarity of a spreadsheet, without the spreadsheet.
        </h2>
      </div>

      <dl className="mt-16 border-t border-graphite">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="grid gap-x-8 gap-y-2 border-b border-graphite py-8 md:grid-cols-12 md:py-10"
          >
            <dt className={`${eyebrow} md:col-span-3 md:pt-1.5`}>
              {feature.category}
            </dt>
            <dd className="md:col-span-9">
              <h3 className="text-xl font-medium leading-[1.38] tracking-[-0.02em] text-paper-white">
                {feature.title}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-[1.5] text-mist">
                {feature.body}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
