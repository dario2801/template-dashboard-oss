import { siteConfig } from "@/app/siteConfig"
import { AuthShell } from "@/components/auth/auth-shell"
import { clerkAppearance } from "@/components/auth/clerk-appearance"
import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `Create your ${siteConfig.name} account`,
}

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUp appearance={clerkAppearance} />
    </AuthShell>
  )
}
