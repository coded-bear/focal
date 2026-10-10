import type { Metadata } from "next";
import { HeroSection } from "@/app/[lang]/_components/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/config/site";
import { paths } from "@/constants";
import { defaultLocale, locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localizedPath } from "@/lib/localizedPath";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { title, description } = dict.metadata;
  const canonical = localizedPath(locale, paths.home);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          locales.map((item) => [item, localizedPath(item, paths.home)]),
        ),
        "x-default": localizedPath(defaultLocale, paths.home),
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Home() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <>
      <div className="flex min-h-svh flex-col">
        <Header locale={locale} strings={dict.header} />
        <main className="flex flex-1 items-center">
          <HeroSection locale={locale} dict={dict} />
        </main>
      </div>
      <Footer strings={dict.footer} />
    </>
  );
}
