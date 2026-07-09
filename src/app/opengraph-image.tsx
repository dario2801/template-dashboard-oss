import { ImageResponse } from "next/og"
import { siteConfig } from "@/app/siteConfig"

// The node build of @vercel/og resolves its default font via fileURLToPath, which throws on
// Windows paths at import time. The edge build skips that lookup.
export const runtime = "edge"

export const alt = siteConfig.description
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #3730A3 0%, #1E1B4B 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: "10px",
              width: "112px",
              height: "112px",
              paddingBottom: "26px",
              borderRadius: "26px",
              background: "#4F46E5",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "34px",
                borderRadius: "5px",
                background: "rgba(255,255,255,0.85)",
              }}
            />
            <div
              style={{
                width: "16px",
                height: "58px",
                borderRadius: "5px",
                background: "rgba(255,255,255,0.85)",
              }}
            />
            <div
              style={{
                width: "16px",
                height: "78px",
                borderRadius: "5px",
                background: "#ffffff",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            {siteConfig.name}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: "34px", fontWeight: 400, color: "#C7D2FE" }}>
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
