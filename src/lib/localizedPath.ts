import type { Locale } from "@/i18n/config";

/** Builds an internal URL from a locale and an entry of `paths`. */
export const localizedPath = (locale: Locale, path: string) =>
  `/${locale}${path === "/" ? "" : path}`;
