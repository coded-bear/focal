import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const { background, foreground, accent } = siteConfig.imageColors;

// The drawing of `icon.svg` without rounded corners: iOS applies its own mask.
// It lives under `[lang]` because the proxy redirects extensionless root paths.
export default function AppleIcon() {
  return new ImageResponse(
    <svg {...size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" fill={background} />
      <path d="M32 7v7M32 50v7" stroke={foreground} strokeWidth="3.5" />
      <circle cx="32" cy="32" r="12" stroke={accent} strokeWidth="6" />
    </svg>,
    size,
  );
}
