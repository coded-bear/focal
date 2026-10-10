import type { CSSProperties } from "react";
import type { Word } from "@/lib/rsvp";
import type { ReaderIndexStore } from "./Reader.types";
import { useReaderIndex } from "./useReaderIndex";

interface ReaderStageProps {
  store: ReaderIndexStore;
  words: Word[];
  onToggle: () => void;
}

const length = (value: string) => Array.from(value).length;

export const ReaderStage = ({ store, words, onToggle }: ReaderStageProps) => {
  const index = useReaderIndex(store);
  const word = words.at(index < 0 ? words.length : index);
  // Width in characters of the word once it is centred on its pivot.
  const span = word
    ? 2 * Math.max(length(word.before), length(word.after)) + 1
    : 1;
  const style: CSSProperties & Record<"--word-span", number> = {
    "--word-span": span,
  };

  return (
    <div
      aria-hidden="true"
      onClick={onToggle}
      className="@container relative flex h-stage cursor-pointer items-center border-y select-none"
    >
      <span className="absolute top-0 left-1/2 h-tick w-0.5 -translate-x-1/2 bg-focal" />
      <span className="absolute bottom-0 left-1/2 h-tick w-0.5 -translate-x-1/2 bg-focal" />
      {word && (
        <p
          style={style}
          className="flex w-full font-mono text-word-fit font-medium whitespace-pre"
        >
          <span className="flex min-w-0 flex-1 basis-0 justify-end">
            {word.before}
          </span>
          <span className="text-focal">{word.pivot}</span>
          <span className="min-w-0 flex-1 basis-0">{word.after}</span>
        </p>
      )}
    </div>
  );
};
