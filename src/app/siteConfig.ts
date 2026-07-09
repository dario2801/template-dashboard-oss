export const siteConfig = {
  name: "Nova Analytics",
  tagline: "Turn raw data into clear decisions.",
  description:
    "Nova Analytics is the data dashboard that turns your metrics into clear, actionable insight.",
  url: "https://nova-analytics.vercel.app",
  supportEmail: "hello@novaanalytics.io",
  sampleUser: "admin@novaanalytics.io",
  baseLinks: {
    home: "/",
    overview: "/overview",
    details: "/details",
    settings: "/settings",
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
  externalLink: {
    blocks: "/overview",
  },
}

export type siteConfig = typeof siteConfig
