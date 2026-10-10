import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/** The wordmark from `docs/assets/focal-wordmark.svg`; the red `o` is its pivot. */
export const Logo = ({ className }: LogoProps) => (
  <svg
    viewBox="0 0 238 136"
    fill="none"
    stroke="currentColor"
    strokeWidth="8"
    aria-hidden="true"
    className={cn("h-9 w-auto", className)}
  >
    <path d="M20 104V44a16 16 0 0 1 16-16h6M6 58h34" />
    <path d="M151.09 65.5a21 21 0 1 0 0 27" />
    <circle cx="185" cy="79" r="21" />
    <path d="M206 54v50" />
    <path d="M226 24v80" />
    <g className="stroke-focal">
      <circle cx="75" cy="79" r="21" />
      <path d="M75 20v18M75 120v16" strokeWidth="4" />
    </g>
  </svg>
);
