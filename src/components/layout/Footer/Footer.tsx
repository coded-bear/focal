import { Kbd } from "@/components/ui/kbd";
import { shortcutKeys } from "@/constants";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/lib/interpolate";

interface FooterProps {
  strings: Dictionary["footer"];
}

export const Footer = ({ strings }: FooterProps) => {
  const legend = [
    { keys: shortcutKeys.play, label: strings.shortcutPlay },
    { keys: shortcutKeys.sentence, label: strings.shortcutSentence },
    { keys: shortcutKeys.speed, label: strings.shortcutSpeed },
  ];

  return (
    <footer className="border-t text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 md:px-6">
        <p>
          {interpolate(strings.copyright, { year: new Date().getFullYear() })}
          <span aria-hidden="true"> · </span>
          {strings.privacy}
        </p>
        <dl
          aria-label={strings.shortcuts}
          className="hidden items-center gap-4 md:flex pointer-coarse:hidden"
        >
          {legend.map(({ keys, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <dt className="flex gap-1">
                {keys.map((key) => (
                  <Kbd key={key} className="font-mono">
                    {key}
                  </Kbd>
                ))}
              </dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </footer>
  );
};
