import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { parseText, sentenceTarget, wordDelay, wpmLimits } from "@/lib/rsvp";
import type { ReaderStatus } from "./Reader.types";
import { createReaderIndexStore, emptyStage } from "./useReaderIndex";
import { useReaderWpm } from "./useReaderWpm";

/** Pause before the first word, so the eye can settle on the pivot. */
const leadMs = 600;
/** Empty stage between two loops of the demo. */
const loopMs = 1200;
/** A longer frame means the tab was throttled; do not skip words for it. */
const maxFrameMs = 100;

export function useReader(demoText: string) {
  const [store] = useState(createReaderIndexStore);
  const [customText, setCustomText] = useState<string | null>(null);
  const [intent, setIntent] = useState<ReaderStatus | null>(null);
  const [wpm, setWpm] = useReaderWpm();
  const reducedMotion = useReducedMotion();
  const clock = useRef({ elapsed: 0, hold: leadMs, wpm });
  const suspended = useRef(false);
  const hiddenWhilePlaying = useRef(false);

  const isDemo = customText === null;
  const text = useMemo(
    () => parseText(customText ?? demoText),
    [customText, demoText],
  );
  // Until the visitor acts, the demo autoplays unless they prefer less motion.
  const status: ReaderStatus = intent ?? (reducedMotion ? "paused" : "playing");
  const last = text.words.length - 1;

  useEffect(() => {
    clock.current.wpm = wpm;
  }, [wpm]);

  useEffect(() => {
    if (status !== "playing") {
      if (store.get() === emptyStage) store.set(0);
      return;
    }

    let previous = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const state = clock.current;
      const index = store.get();
      const word = text.words[index];
      const delay = (word ? wordDelay(word, state.wpm) : 0) + state.hold;

      state.elapsed += Math.min(now - previous, maxFrameMs);
      previous = now;

      if (state.elapsed >= delay) {
        state.elapsed -= delay;
        state.hold = 0;

        if (index < last) {
          store.set(index + 1);
        } else if (isDemo) {
          state.elapsed = 0;
          state.hold = loopMs;
          store.set(emptyStage);
        } else {
          setIntent("finished");
          return;
        }
      }

      frame = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(frame);
  }, [status, text, last, isDemo, store]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && status === "playing") {
        hiddenWhilePlaying.current = isDemo;
        setIntent("paused");
      } else if (!document.hidden && hiddenWhilePlaying.current) {
        hiddenWhilePlaying.current = false;
        setIntent("playing");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [status, isDemo]);

  const start = (index: number, hold: number) => {
    clock.current.elapsed = 0;
    clock.current.hold = hold;
    suspended.current = false;
    store.set(index);
    setIntent("playing");
  };

  const seek = (index: number) => {
    clock.current.elapsed = 0;
    clock.current.hold = 0;
    store.set(Math.min(Math.max(index, 0), last));
    if (status === "finished") setIntent("paused");
  };

  return {
    store,
    text,
    status,
    wpm,
    isDemo,
    sourceText: customText ?? demoText,
    customText,
    seek,
    restart: () => seek(0),
    toggle: () => {
      if (status === "finished") start(0, 0);
      else setIntent(status === "playing" ? "paused" : "playing");
    },
    sentence: (direction: -1 | 1) => {
      const target = sentenceTarget(text, Math.max(store.get(), 0), direction);
      if (target !== null) seek(target);
    },
    changeWpm: (steps: number) => setWpm(wpm + steps * wpmLimits.step),
    /** Pauses for a dialog or a drag; `resume` undoes exactly that pause. */
    suspend: () => {
      if (status !== "playing") return;
      suspended.current = true;
      setIntent("paused");
    },
    resume: () => {
      if (!suspended.current) return;
      suspended.current = false;
      setIntent("playing");
    },
    load: (value: string) => {
      setCustomText(value);
      start(0, leadMs);
    },
    backToDemo: () => {
      setCustomText(null);
      start(emptyStage, leadMs);
    },
  };
}

export type ReaderApi = ReturnType<typeof useReader>;
