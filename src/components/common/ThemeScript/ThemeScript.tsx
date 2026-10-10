"use client";

import { themeScript } from "@/lib/theme";

/**
 * Applies the theme before first paint. The script runs only from the server
 * HTML; on the client it is inert `text/plain`, which keeps React from warning
 * about a script tag when the layout re-renders on a language switch.
 */
export const ThemeScript = () => (
  <script
    type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
    suppressHydrationWarning
    dangerouslySetInnerHTML={{ __html: themeScript }}
  />
);
