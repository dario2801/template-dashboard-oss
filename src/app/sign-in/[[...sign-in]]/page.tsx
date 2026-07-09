import { siteConfig } from "@/app/siteConfig"
import { AuthShell } from "@/components/auth/auth-shell"
import { clerkAppearance } from "@/components/auth/clerk-appearance"
import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `Sign in to ${siteConfig.name}`,
}

export default function SignInPage() {
  return (
    <AuthShell>
      <SignIn appearance={clerkAppearance} />
    </AuthShell>
  )
}
