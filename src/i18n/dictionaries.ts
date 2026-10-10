import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { defaultLocale, hasLocale, type Locale } from "./config";

export type Dictionary = typeof import("./dictionaries/pl.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pl: () => import("./dictionaries/pl.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export const getLocale = async () => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();

  return locale;
};

export const getDictionary = async () => dictionaries[await getLocale()]();

/**
 * For metadata image routes, where `next/root-params` is not available.
 * Falls back to the default locale when the route has no locale yet.
 */
export const getDictionaryFor = (locale: string | undefined) =>
  dictionaries[locale && hasLocale(locale) ? locale : defaultLocale]();
