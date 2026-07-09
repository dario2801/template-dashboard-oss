export const siteConfig = {
  name: "Nova Analytics",
  tagline: "Turn raw data into clear decisions.",
  description:
    "Nova Analytics is the data dashboard that turns your metrics into clear, actionable insight.",
  url: "https://nova-analytics.vercel.app",
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
