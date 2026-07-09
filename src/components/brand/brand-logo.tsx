import { cx } from "@/lib/utils"
import type { SVGProps } from "react"
import { siteConfig } from "@/app/siteConfig"

type BrandLogoProps = SVGProps<SVGSVGElement> & {
  variant?: "full" | "icon"
}

function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="8"
        className="fill-brand-600"
      />
      <rect
        x="8"
        y="17"
        width="3.2"
        height="7"
        rx="1"
        className="fill-white/85"
      />
      <rect
        x="14.4"
        y="12"
        width="3.2"
        height="12"
        rx="1"
        className="fill-white/85"
      />
      <rect
        x="20.8"
        y="8"
        width="3.2"
        height="16"
        rx="1"
        className="fill-white"
      />
    </svg>
  )
}

export function BrandLogo({
  variant = "full",
  className,
  ...props
}: BrandLogoProps) {
  if (variant === "icon") {
    return <BrandMark className={cx("size-8", className)} {...props} />
  }

  // The wordmark color lives on the wrapper so a caller's className can override it
  // through twMerge. On the inner span it would win by element specificity instead.
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 text-gray-900 dark:text-gray-50",
        className,
      )}
    >
      <BrandMark className="size-8 shrink-0" {...props} />
      <span className="text-lg font-semibold tracking-tight">
        {siteConfig.name}
      </span>
    </span>
  )
}
