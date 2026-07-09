export const siteConfig = {
  name: "Nova Analytics",
  tagline: "Turn raw data into clear decisions.",
  description:
    "Nova Analytics is the data dashboard that turns your metrics into clear, actionable insight.",
  // Feeds metadataBase and the Open Graph tags, so the value is public. The
  // fallback must stay brand-owned: a Vercel project name leaks into link previews.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://nova-analytics-dashboard.vercel.app",
  supportEmail: "hello@novaanalytics.io",
  sampleUser: {
    name: "Nova Admin",
    initials: "NA",
    email: "admin@novaanalytics.io",
  },
  baseLinks: {
    home: "/",
    overview: "/overview",
    details: "/details",
    settings: "/settings",
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
}

export type siteConfig = typeof siteConfig
