import Image from "next/image"
import { eyebrow, sectionShell } from "./styles"

export function DashboardPreview() {
  return (
    <section id="dashboard" className={`${sectionShell} pt-32 lg:pt-40`}>
      <div className="max-w-2xl">
        <p className={eyebrow}>Inside Nova</p>
        <h2 className="mt-4 font-display text-[40px] font-normal leading-[1.15] tracking-[0.01em] text-paper-white lg:text-[52px]">
          Every metric, on one screen.
        </h2>
        <p className="mt-5 max-w-md text-base leading-[1.5] text-mist">
          Usage, workspace, and cost sit side by side, so you see what a change
          cost you before the invoice does.
        </p>
      </div>

      <figure className="mt-16">
        <div className="overflow-hidden rounded-[10px] border border-graphite bg-carbon">
          <Image
            src="/dashboard-overview.png"
            alt="The Nova Analytics overview page, showing the current billing cycle with usage at 68.1 percent of allowed capacity, 21.7 percent weekly active users, and $293.50 in current costs, above a set of trend charts for rows read, rows written, and queries."
            width={1920}
            height={869}
            sizes="(min-width: 1216px) 1216px, 100vw"
            className="h-auto w-full"
          />
        </div>
        <figcaption className="mt-4 text-sm text-steel">
          The overview page, with sample data.
        </figcaption>
      </figure>
    </section>
  )
}
