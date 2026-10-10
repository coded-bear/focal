import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Reader } from "@/app/[lang]/_components/Reader";

interface HeroSectionProps {
  locale: Locale;
  dict: Pick<Dictionary, "hero" | "reader" | "paste">;
}

export const HeroSection = ({ locale, dict }: HeroSectionProps) => (
  <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 md:px-6">
    <h1 className="text-center font-mono text-xs font-normal tracking-widest text-balance text-muted-foreground uppercase">
      {dict.hero.title}
    </h1>
    <Reader
      demoText={dict.hero.demoText}
      locale={locale}
      strings={dict.reader}
      pasteStrings={dict.paste}
    />
    <p className="mx-auto max-w-prose text-center text-sm leading-relaxed text-pretty text-muted-foreground">
      {dict.hero.description}
    </p>
  </section>
);
