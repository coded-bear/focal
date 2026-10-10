import { useSyncExternalStore } from "react";
import { wpmLimits } from "@/lib/rsvp";

const storageKey = "focal-wpm";
const listeners = new Set<() => void>();
// Holds the value when storage is unavailable (private mode, blocked cookies).
let memory: number | null = null;

const clamp = (wpm: number) =>
  Math.min(Math.max(wpm, wpmLimits.min), wpmLimits.max);

function read() {
  if (memory !== null) return memory;

  try {
    const stored = Number(localStorage.getItem(storageKey));
    if (Number.isInteger(stored) && stored === clamp(stored)) return stored;
  } catch {
    // Fall through to the default.
  }

  return wpmLimits.initial;
}

function write(wpm: number) {
  memory = clamp(wpm);
  try {
    localStorage.setItem(storageKey, String(memory));
  } catch {
    // The value stays in memory for this visit.
  }
  listeners.forEach((listener) => listener());
}

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);

  return () => listeners.delete(onChange);
};

/** WPM persisted in `localStorage`; the server render always uses the default. */
export function useReaderWpm() {
  const wpm = useSyncExternalStore(subscribe, read, () => wpmLimits.initial);

  return [wpm, write] as const;
}
