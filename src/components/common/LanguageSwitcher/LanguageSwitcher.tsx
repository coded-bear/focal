import Link from "next/link";
import { paths } from "@/constants";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/lib/localizedPath";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  locale: Locale;
  strings: Pick<Dictionary["header"], "language" | "languages">;
}

export const LanguageSwitcher = ({
  locale,
  strings,
}: LanguageSwitcherProps) => (
  <nav aria-label={strings.language}>
    <ul className="flex items-center font-mono text-xs tracking-widest uppercase">
      {locales.map((item, index) => (
        <li key={item} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="text-muted-foreground">
              ·
            </span>
          )}
          <Link
            href={localizedPath(item, paths.home)}
            hrefLang={item}
            lang={item}
            title={strings.languages[item]}
            aria-label={strings.languages[item]}
            aria-current={item === locale ? "true" : undefined}
            className={cn(
              "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 transition-colors duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              item === locale
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
