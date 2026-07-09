"use client"

import { useUser } from "@clerk/nextjs"

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export type SessionIdentity = {
  isLoaded: boolean
  name: string
  email: string
  initials: string
}

/**
 * The signed-in user, shaped for display. Falls back to the email when the account
 * carries no name, which is the common case for a fresh Clerk sign-up.
 */
export function useSessionIdentity(): SessionIdentity {
  const { user, isLoaded } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? ""
  const name = user?.fullName?.trim() || email

  return { isLoaded, name, email, initials: name ? initialsOf(name) : "" }
}
