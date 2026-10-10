import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "./config";

export type Dictionary = typeof import("./dictionaries/pl.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pl: () => import("./dictionaries/pl.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async () => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();

  return dictionaries[locale]();
};
