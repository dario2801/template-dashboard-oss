import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "selector",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
          950: "rgb(var(--brand-950) / <alpha-value>)",
          DEFAULT: "rgb(var(--brand-600) / <alpha-value>)",
        },
        // Editorial dark surface stack, declared darkest to lightest. Scoped to the
        // public marketing and auth pages, which render dark regardless of the
        // dashboard theme. Anything above the page plane is lighter than it, so
        // onyx is a recessed surface (auth card) and carbon is a raised one.
        // Never name a token here after a default Tailwind color: a bare string
        // overwrites that color's whole numeric scale, so `slate` would take out
        // `slate-500` everywhere.
        onyx: "#040406",
        obsidian: "#08080a",
        carbon: "#121317",
        graphite: "#1c1d22",
        steel: "#777a88",
        fog: "#9194a1",
        mist: "#acafb9",
        bone: "#e2e3e9",
        "paper-white": "#ffffff",
        copper: "#cc9166",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        gilded:
          "linear-gradient(103deg, rgb(174, 147, 87), rgb(255, 240, 204) 40%, rgb(174, 147, 87) 70%, rgba(189, 157, 79, 0))",
        // Same gold, but opaque at both ends. `gilded` fades its tail to alpha 0,
        // which erases the last glyphs of a short string when clipped to text.
        "gilded-text":
          "linear-gradient(103deg, rgb(174, 147, 87), rgb(255, 240, 204) 45%, rgb(174, 147, 87))",
      },
      maxWidth: {
        page: "1216px",
      },
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        dialogOverlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        dialogContentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -45%) scale(0.95)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        drawerSlideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(50%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        // The dasharray lives inside the keyframes, not on the element. With
        // `motion-reduce:animate-none` the polyline then has no dash at all and
        // renders fully drawn, instead of being stuck at a full offset and invisible.
        drawLine: {
          from: { strokeDasharray: "520", strokeDashoffset: "520" },
          to: { strokeDasharray: "520", strokeDashoffset: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        hide: "hide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        drawerSlideLeftAndFade:
          "drawerSlideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogOverlayShow:
          "dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogContentShow:
          "dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        drawLine: "drawLine 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        fadeIn: "fadeIn 600ms 300ms cubic-bezier(0.16, 1, 0.3, 1) backwards",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
export default config
