// Clerk's `variables` are injected as inline CSS custom properties, so they cannot
// reference Tailwind classes. The palette is mirrored here as literal values.
export const clerkAppearance = {
  variables: {
    colorBackground: "#040406",
    colorPrimary: "#ffffff",
    colorText: "#e2e3e9",
    colorTextSecondary: "#9194a1",
    colorInputBackground: "#121317",
    colorInputText: "#e2e3e9",
    colorDanger: "#cc9166",
    // Clerk derives every element's radius from this one, the card included, and
    // injects it inline so no Tailwind class can override it. A pill value here
    // rounds the card into an ellipse. Pills are opted into per element below.
    borderRadius: "10px",
    fontFamily: "var(--font-inter)",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "bg-onyx border border-graphite rounded-[10px] shadow-none",
    headerTitle: "font-display text-2xl font-normal text-paper-white",
    headerSubtitle: "text-fog",
    socialButtonsBlockButton:
      "border border-steel text-bone hover:bg-carbon rounded-full",
    dividerLine: "bg-graphite",
    dividerText: "text-steel",
    formFieldLabel: "text-mist",
    formFieldInput: "bg-carbon border border-graphite text-bone rounded-full",
    formButtonPrimary:
      "bg-paper-white text-black hover:bg-mist rounded-full text-sm font-medium normal-case",
    footerActionText: "text-fog",
    footerActionLink: "text-copper hover:text-copper/80",
    identityPreviewText: "text-bone",
    identityPreviewEditButton: "text-copper",
    formFieldInputShowPasswordButton: "text-steel hover:text-bone",
    otpCodeFieldInput: "border border-graphite text-bone",
    footer: "hidden",
  },
}
