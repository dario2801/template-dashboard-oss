import { clerkMiddleware } from "@clerk/nextjs/server"

// clerkMiddleware only attaches the session. Authorization lives in each protected
// layout via auth.protect(), because path matching here can diverge from how Next
// resolves routes and leave protected resources reachable.
export default clerkMiddleware()

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
