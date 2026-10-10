import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { paths } from "@/constants";
import { locales, type Locale } from "@/i18n/config";

const localizedUrl = (locale: Locale, path: string) =>
  `${siteConfig.url}/${locale}${path === "/" ? "" : path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(paths).flatMap((path) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, localizedUrl(locale, path)]),
    );

    return locales.map((locale) => ({
      url: localizedUrl(locale, path),
      alternates: { languages },
    }));
  });
}
