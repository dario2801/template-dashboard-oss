const POINTS = [
  [0, 96],
  [52, 82],
  [104, 88],
  [156, 61],
  [208, 68],
  [260, 44],
  [312, 50],
  [364, 24],
  [416, 30],
  [468, 8],
] as const

const line = POINTS.map(([x, y]) => `${x},${y}`).join(" ")
const area = `${line} 468,120 0,120`

// The gilded gradient marks a measured quantity. Used here and on the Stats
// figures, and nowhere else. See `gildedFigure` in ./styles.
export function RevenueChart() {
  return (
    <svg
      viewBox="0 0 468 120"
      fill="none"
      className="h-28 w-full"
      role="img"
      aria-label="Revenue trending upward over the last ten periods"
    >
      <defs>
        <linearGradient id="gilded-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(174, 147, 87)" />
          <stop offset="40%" stopColor="rgb(255, 240, 204)" />
          <stop offset="70%" stopColor="rgb(174, 147, 87)" />
          <stop offset="100%" stopColor="rgba(189, 157, 79, 0)" />
        </linearGradient>
        <linearGradient id="gilded-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(174, 147, 87)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="rgb(174, 147, 87)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={area}
        fill="url(#gilded-fill)"
        className="animate-fadeIn motion-reduce:animate-none"
      />
      <polyline
        points={line}
        stroke="url(#gilded-stroke)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-drawLine motion-reduce:animate-none"
      />
    </svg>
  )
}
