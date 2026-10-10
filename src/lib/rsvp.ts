export interface Word {
  before: string;
  pivot: string;
  after: string;
  /** Delay multiplier for this word, applied to the base delay of the WPM. */
  factor: number;
  endsSentence: boolean;
}

export interface ParsedText {
  words: Word[];
  /** Indexes of the first word of every sentence, ascending. */
  sentenceStarts: number[];
  /** `factorTail[i]` is the sum of the factors of words `i` to the end. */
  factorTail: number[];
}

export const wpmLimits = {
  min: 100,
  max: 1000,
  step: 25,
  initial: 300,
} as const;

const edgePunctuation = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;
const leadingPunctuation = /^[^\p{L}\p{N}]+/u;
const closers = /["'”’»)\]]+$/u;
const afterSeparator = /(?<=[-–—/])/u;
const separators = /[-–—/]/gu;

const longWord = { core: 13, piece: 12 } as const;

const length = (value: string) => Array.from(value).length;

export function pivotIndex(coreLength: number) {
  if (coreLength <= 1) return 0;
  if (coreLength <= 5) return 1;
  if (coreLength <= 9) return 2;
  if (coreLength <= 13) return 3;

  return 4;
}

function splitCompound(token: string) {
  const parts = token.split(afterSeparator);
  const splittable =
    parts.length > 1 &&
    parts.every((part) => length(part.replace(separators, "")) >= 2);

  return splittable ? parts : [token];
}

/** Breaks a word too long to read at a glance into hyphenated pieces. */
function splitLong(token: string) {
  if (length(token.replace(edgePunctuation, "")) <= longWord.core) {
    return [token];
  }

  const chars = Array.from(token);
  const count = Math.ceil(chars.length / longWord.piece);
  const size = Math.ceil(chars.length / count);

  return Array.from({ length: count }, (_, index) => {
    const piece = chars.slice(index * size, (index + 1) * size).join("");

    return index < count - 1 ? `${piece}-` : piece;
  });
}

function toWord(token: string, lastInParagraph: boolean): Word {
  const chars = Array.from(token);
  const stripped = token.replace(edgePunctuation, "");
  // A token made only of punctuation is its own core.
  const lead = stripped
    ? length(token.match(leadingPunctuation)?.[0] ?? "")
    : 0;
  const coreLength = stripped ? length(stripped) : chars.length;
  const at = lead + pivotIndex(coreLength);

  const ending = token.replace(closers, "");
  const endsSentence = /[.!?…]$/u.test(ending);
  let factor = 1;
  if (lastInParagraph) factor = 3;
  else if (endsSentence) factor = 2;
  else if (/[,;:]$/u.test(ending)) factor = 1.5;
  if (coreLength > 8) factor += 0.3;

  return {
    before: chars.slice(0, at).join(""),
    pivot: chars[at] ?? "",
    after: chars.slice(at + 1).join(""),
    factor,
    endsSentence: endsSentence || lastInParagraph,
  };
}

export function parseText(text: string): ParsedText {
  const words = text
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.split(/\s+/u).filter(Boolean))
    .filter((tokens) => tokens.length > 0)
    .flatMap((tokens) => {
      const parts = tokens.flatMap(splitCompound).flatMap(splitLong);

      return parts.map((part, index) =>
        toWord(part, index === parts.length - 1),
      );
    });

  const sentenceStarts = words.flatMap((_, index) =>
    index === 0 || words[index - 1].endsSentence ? [index] : [],
  );

  const factorTail = new Array<number>(words.length + 1).fill(0);
  for (let index = words.length - 1; index >= 0; index -= 1) {
    factorTail[index] = factorTail[index + 1] + words[index].factor;
  }

  return { words, sentenceStarts, factorTail };
}

export const baseDelay = (wpm: number) => 60000 / wpm;

export const wordDelay = (word: Word, wpm: number) =>
  baseDelay(wpm) * word.factor;

/** Reading time in ms from the word at `from` to the end, pauses included. */
export const remainingTime = (text: ParsedText, from: number, wpm: number) =>
  baseDelay(wpm) * (text.factorTail[Math.max(from, 0)] ?? 0);

/** Start of the previous (-1) or next (1) sentence, or `null` at the end. */
export function sentenceTarget(
  text: ParsedText,
  index: number,
  direction: -1 | 1,
) {
  const starts = text.sentenceStarts;
  const current = starts.findLastIndex((start) => start <= index);

  if (direction === 1) return starts[current + 1] ?? null;
  // Close to the start of a sentence, "back" means the sentence before it.
  if (index - starts[current] < 3) return starts[Math.max(current - 1, 0)];

  return starts[current];
}

export function formatDuration(ms: number) {
  const seconds = Math.ceil(ms / 1000);

  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
