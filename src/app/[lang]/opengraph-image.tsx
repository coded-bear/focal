import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getDictionaryFor } from "@/i18n/dictionaries";

interface ImageParams {
  // Empty while the build collects image ids, before any locale is known.
  params: Promise<{ lang?: string }>;
}

const size = { width: 1200, height: 630 };
const { background, foreground, muted, accent } = siteConfig.imageColors;

export async function generateImageMetadata({ params }: ImageParams) {
  const dict = await getDictionaryFor((await params).lang);

  return [
    { id: "default", alt: dict.metadata.ogAlt, size, contentType: "image/png" },
  ];
}

export default async function OpengraphImage({ params }: ImageParams) {
  const dict = await getDictionaryFor((await params).lang);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
        width: "100%",
        height: "100%",
        background,
      }}
    >
      {/* The wordmark from docs/assets/focal-wordmark.svg. */}
      <svg
        width="420"
        height="240"
        viewBox="0 0 238 136"
        fill="none"
        stroke={foreground}
        strokeWidth="8"
      >
        <path d="M20 104V44a16 16 0 0 1 16-16h6M6 58h34" />
        <path d="M151.09 65.5a21 21 0 1 0 0 27" />
        <circle cx="185" cy="79" r="21" />
        <path d="M206 54v50" />
        <path d="M226 24v80" />
        <circle cx="75" cy="79" r="21" stroke={accent} />
        <path d="M75 20v18M75 120v16" stroke={accent} strokeWidth="4" />
      </svg>
      <div style={{ fontSize: 30, letterSpacing: 2, color: muted }}>
        {dict.hero.title}
      </div>
    </div>,
    size,
  );
}
