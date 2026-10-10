import { useId } from "react";
import { Slider } from "@/components/ui/slider";
import { interpolate } from "@/lib/interpolate";
import { formatDuration, remainingTime, type ParsedText } from "@/lib/rsvp";
import type { ReaderIndexStore, ReaderStrings } from "./Reader.types";
import { useReaderIndex } from "./useReaderIndex";

interface ReaderProgressProps {
  store: ReaderIndexStore;
  text: ParsedText;
  wpm: number;
  isDemo: boolean;
  finished: boolean;
  strings: ReaderStrings;
  onSeek: (index: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
  onBackToDemo: () => void;
}

const minDigits = 3;

export const ReaderProgress = ({
  store,
  text,
  wpm,
  isDemo,
  finished,
  strings,
  onSeek,
  onSeekStart,
  onSeekEnd,
  onBackToDemo,
}: ReaderProgressProps) => {
  const labelId = useId();
  const index = useReaderIndex(store);
  const total = text.words.length;
  const digits = Math.max(String(total).length, minDigits);
  const pad = (value: number) => String(value).padStart(digits, "0");
  const time = formatDuration(remainingTime(text, index, wpm));

  return (
    <div>
      <span id={labelId} className="sr-only">
        {strings.progress}
      </span>
      {/* Pulled up so the track lies on the stage's bottom hairline. */}
      <Slider
        aria-labelledby={labelId}
        min={1}
        max={Math.max(total, 2)}
        value={[Math.max(index + 1, 1)]}
        onValueChange={(value) => {
          onSeekStart();
          onSeek((Array.isArray(value) ? value[0] : value) - 1);
        }}
        onValueCommitted={onSeekEnd}
        className="relative z-10 -mt-px **:data-[slot=slider-range]:bg-focal! **:data-[slot=slider-thumb]:h-3! **:data-[slot=slider-thumb]:w-0.5! **:data-[slot=slider-thumb]:rounded-none! **:data-[slot=slider-thumb]:border-0! **:data-[slot=slider-thumb]:bg-foreground! **:data-[slot=slider-track]:h-0.5! **:data-[slot=slider-track]:rounded-none! **:data-[slot=slider-track]:bg-border!"
      />
      <div className="mt-3 flex items-center justify-between gap-4 font-mono text-xs tracking-widest text-muted-foreground uppercase tabular-nums">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {/* "Back to demo" already says the text is custom; a phone has no room for both. */}
          <span className={isDemo ? undefined : "max-sm:hidden"}>
            {isDemo ? strings.sourceDemo : strings.sourceCustom}
          </span>
          <span>
            {finished
              ? interpolate(strings.summary, {
                  count: total,
                  time: formatDuration(remainingTime(text, 0, wpm)),
                })
              : interpolate(strings.position, {
                  current: pad(index + 1),
                  total: pad(total),
                })}
          </span>
          {!isDemo && (
            <button
              type="button"
              onClick={onBackToDemo}
              className="-my-1.5 rounded-sm py-1.5 tracking-widest uppercase underline underline-offset-4 transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {strings.backToDemo}
            </button>
          )}
        </div>
        {!finished && (
          <span>
            <span className="sr-only">
              {interpolate(strings.timeLeft, { time })}
            </span>
            <span aria-hidden="true">{time}</span>
          </span>
        )}
      </div>
    </div>
  );
};
