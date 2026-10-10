import type { Dictionary } from "@/i18n/dictionaries";

export type ReaderStrings = Dictionary["reader"];
export type ReaderPasteStrings = Dictionary["paste"];

export const readerStatuses = ["playing", "paused", "finished"] as const;
export type ReaderStatus = (typeof readerStatuses)[number];

/** Position in the text, kept outside React state so only its readers re-render. */
export interface ReaderIndexStore {
  /** Index of the word on the stage, or -1 while the stage is empty. */
  get: () => number;
  set: (index: number) => void;
  subscribe: (onChange: () => void) => () => void;
}
