import { siteConfig } from "@/app/siteConfig"
import { Show } from "@clerk/nextjs"
import Link from "next/link"
import { primaryPill, sectionShell } from "./styles"

export function Cta() {
  return (
    <section className={`${sectionShell} pt-32 lg:pt-40`}>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-[40px] font-normal leading-[1.15] tracking-[0.01em] text-paper-white lg:text-[52px]">
          Start reading your data today.
        </h2>
        <p className="mt-5 text-base leading-[1.5] text-mist">
          Create an account and open a working dashboard in under a minute.
        </p>
        <div className="mt-9 flex justify-center">
          <Show
            when="signed-in"
            fallback={
              <Link href={siteConfig.baseLinks.signUp} className={primaryPill}>
                Create your account
              </Link>
            }
          >
            <Link href={siteConfig.baseLinks.overview} className={primaryPill}>
              Open your dashboard
            </Link>
          </Show>
        </div>
      </div>
    </section>
  )
}
