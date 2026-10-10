import type { ReactNode, RefObject } from "react";
import {
  ClipboardPaste,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  SkipBack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { shortcutKeys } from "@/constants";
import { interpolate } from "@/lib/interpolate";
import { wpmLimits } from "@/lib/rsvp";
import type { ReaderStatus, ReaderStrings } from "./Reader.types";

interface ReaderControlsProps {
  status: ReaderStatus;
  wpm: number;
  strings: ReaderStrings;
  playButtonRef: RefObject<HTMLButtonElement | null>;
  pasteButtonRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
  onRestart: () => void;
  onChangeWpm: (steps: number) => void;
  onPaste: () => void;
}

interface HintProps {
  label: string;
  keys: readonly string[];
  children: ReactNode;
  /** The button, without children; the tooltip supplies them. */
  button: React.ReactElement<Record<string, unknown>>;
}

const Hint = ({ label, keys, button, children }: HintProps) => (
  <Tooltip>
    <TooltipTrigger render={button} aria-label={label}>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      {label}
      {keys.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </TooltipContent>
  </Tooltip>
);

export const ReaderControls = ({
  status,
  wpm,
  strings,
  playButtonRef,
  pasteButtonRef,
  onToggle,
  onRestart,
  onChangeWpm,
  onPaste,
}: ReaderControlsProps) => {
  const playLabel = {
    playing: strings.pause,
    paused: strings.play,
    finished: strings.replay,
  }[status];
  const PlayIcon = { playing: Pause, paused: Play, finished: RotateCcw }[
    status
  ];

  return (
    <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
      {/* The play button sits on the same axis as the pivot letter. */}
      <div className="flex items-center justify-center gap-3 sm:order-2">
        <Hint
          label={strings.restart}
          keys={shortcutKeys.restart}
          button={<Button variant="ghost" size="icon-lg" onClick={onRestart} />}
        >
          <SkipBack />
        </Hint>
        <Hint
          label={playLabel}
          keys={shortcutKeys.play}
          button={
            <Button
              ref={playButtonRef}
              className="size-12 rounded-full"
              onClick={onToggle}
            />
          }
        >
          <PlayIcon
            className="size-5"
            fill={status === "finished" ? "none" : "currentColor"}
          />
        </Hint>
        <span aria-hidden="true" className="size-9" />
      </div>
      <div
        role="group"
        aria-label={strings.speed}
        className="flex items-center justify-center gap-1 sm:order-1 sm:-ml-2.5 sm:justify-start"
      >
        <Hint
          label={strings.slower}
          keys={[shortcutKeys.speed[1]]}
          button={
            <Button
              variant="ghost"
              size="icon-lg"
              disabled={wpm <= wpmLimits.min}
              onClick={() => onChangeWpm(-1)}
            />
          }
        >
          <Minus />
        </Hint>
        <output className="w-28 text-center font-mono text-xs tracking-widest uppercase tabular-nums">
          {interpolate(strings.wpm, { value: wpm })}
        </output>
        <Hint
          label={strings.faster}
          keys={[shortcutKeys.speed[0]]}
          button={
            <Button
              variant="ghost"
              size="icon-lg"
              disabled={wpm >= wpmLimits.max}
              onClick={() => onChangeWpm(1)}
            />
          }
        >
          <Plus />
        </Hint>
      </div>
      <div className="flex justify-center sm:order-3 sm:justify-end">
        <Button
          ref={pasteButtonRef}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={onPaste}
        >
          <ClipboardPaste data-icon="inline-start" />
          {strings.paste}
          <Kbd className="hidden md:inline-flex pointer-coarse:hidden">
            {shortcutKeys.paste[0]}
          </Kbd>
        </Button>
      </div>
    </div>
  );
};
