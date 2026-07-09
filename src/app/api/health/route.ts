import { siteConfig } from "@/app/siteConfig"
import { NextResponse } from "next/server"

// Uptime probes must observe the live instance, never a build-time snapshot.
export const dynamic = "force-dynamic"

export function GET() {
  return NextResponse.json({
    status: "ok",
    name: siteConfig.name,
    timestamp: new Date().toISOString(),
  })
}
