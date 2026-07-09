// Shared control shapes for the marketing surface. The white filled pill is a scarce
// resource: at most one per viewport, reserved for the highest-emphasis action.
export const primaryPill =
  "inline-flex items-center justify-center rounded-full bg-paper-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper-white"

export const ghostPill =
  "inline-flex items-center justify-center rounded-full border border-paper-white px-5 py-2.5 text-sm font-medium text-paper-white transition-colors hover:bg-paper-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper-white"

export const tagPill =
  "inline-flex items-center rounded-full border border-steel px-2.5 py-1.5 text-xs font-medium text-paper-white"

export const eyebrow =
  "text-[13px] font-semibold tracking-[-0.02em] text-copper"

// Gold marks a measured quantity, and only where the page makes a quantitative
// claim to the reader: the revenue line and the figures in Stats. The sample
// dashboard's own numbers stay white so the card reads as product, not marketing.
export const gildedFigure = "bg-gilded-text bg-clip-text text-transparent"

export const sectionShell = "mx-auto w-full max-w-page px-6"
