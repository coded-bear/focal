import Link from "next/link";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { paths } from "@/constants";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/lib/localizedPath";

interface HeaderProps {
  locale: Locale;
  strings: Dictionary["header"];
}

export const Header = ({ locale, strings }: HeaderProps) => (
  <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6">
    <Link
      href={localizedPath(locale, paths.home)}
      aria-label={strings.home}
      className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Logo />
    </Link>
    <div className="flex items-center gap-2">
      <LanguageSwitcher locale={locale} strings={strings} />
      <ThemeToggle strings={strings} />
    </div>
  </header>
);
