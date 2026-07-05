import { ImageResponse } from "next/og";
import { PRODUCT_NAME } from "@/lib/brand";

export const runtime = "edge";
export const alt = `${PRODUCT_NAME} — AI-валидация бизнес-идеи`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background: "#0A0A0B",
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "#FF6B35",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 24,
          }}
        >
          maxima consulting
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          {PRODUCT_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#8E8E93",
            lineHeight: 1.4,
            maxWidth: 800,
            marginBottom: 48,
          }}
        >
          AI-валидация бизнес-идеи: юнит-экономика, риски и go/no-go вердикт
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div
            style={{
              background: "#2ECC71",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: 12,
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            Этапы 0–1 бесплатно
          </div>
          <div style={{ fontSize: 28, color: "#2ECC71", fontWeight: 600 }}>
            Полный разбор — 999 ₽
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
