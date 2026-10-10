"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ReaderPasteStrings, ReaderStrings } from "./Reader.types";
import { ReaderControls } from "./ReaderControls";
import { ReaderPasteDialog } from "./ReaderPasteDialog";
import { ReaderProgress } from "./ReaderProgress";
import { ReaderStage } from "./ReaderStage";
import { useReader } from "./useReader";
import { useReaderShortcuts } from "./useReaderShortcuts";

interface ReaderProps {
  demoText: string;
  locale: Locale;
  strings: ReaderStrings;
  pasteStrings: ReaderPasteStrings;
}

export const Reader = ({
  demoText,
  locale,
  strings,
  pasteStrings,
}: ReaderProps) => {
  const reader = useReader(demoText);
  const [pasteOpen, setPasteOpen] = useState(false);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const pasteButtonRef = useRef<HTMLButtonElement>(null);
  const submitted = useRef(false);

  const openPaste = () => {
    submitted.current = false;
    reader.suspend();
    setPasteOpen(true);
  };

  useReaderShortcuts({ ...reader, openPaste }, !pasteOpen);

  const statusLabel = {
    playing: strings.statusPlaying,
    paused: strings.statusPaused,
    finished: strings.statusFinished,
  }[reader.status];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ReaderStage
          store={reader.store}
          words={reader.text.words}
          onToggle={reader.toggle}
        />
        <ReaderProgress
          store={reader.store}
          text={reader.text}
          wpm={reader.wpm}
          isDemo={reader.isDemo}
          finished={reader.status === "finished"}
          strings={strings}
          onSeek={reader.seek}
          onSeekStart={reader.suspend}
          onSeekEnd={reader.resume}
          onBackToDemo={reader.backToDemo}
        />
      </div>
      <ReaderControls
        status={reader.status}
        wpm={reader.wpm}
        strings={strings}
        playButtonRef={playButtonRef}
        pasteButtonRef={pasteButtonRef}
        onToggle={reader.toggle}
        onRestart={reader.restart}
        onChangeWpm={reader.changeWpm}
        onPaste={openPaste}
      />
      <section aria-label={strings.transcript} className="sr-only">
        <p className="whitespace-pre-line">{reader.sourceText}</p>
      </section>
      <p role="status" className="sr-only">
        {statusLabel}
      </p>
      <ReaderPasteDialog
        open={pasteOpen}
        initialText={reader.customText ?? ""}
        wpm={reader.wpm}
        locale={locale}
        strings={pasteStrings}
        // After "Read", Space should pause the text, not reopen the dialog.
        getReturnFocus={() =>
          (submitted.current ? playButtonRef : pasteButtonRef).current
        }
        onCancel={() => {
          setPasteOpen(false);
          reader.resume();
        }}
        onSubmit={(text) => {
          submitted.current = true;
          setPasteOpen(false);
          reader.load(text);
        }}
      />
    </div>
  );
};
