import { useEffect, useEffectEvent } from "react";
import type { ReaderApi } from "./useReader";

type ShortcutActions = Pick<
  ReaderApi,
  "toggle" | "sentence" | "changeWpm" | "restart"
> & { openPaste: () => void };

const textFields =
  "input:not([type='range']), textarea, select, [contenteditable='true']";
const ownSpace = "button, a, summary";

/** Global keys for the reader. Off while `enabled` is false (dialog open). */
export function useReaderShortcuts(actions: ShortcutActions, enabled: boolean) {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    // Leave Cmd+V, Cmd+R and the like to the browser.
    if (!enabled || event.ctrlKey || event.altKey || event.metaKey) return;

    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(textFields)) return;
    // The progress slider keeps its own arrow keys: one word per press.
    if (target?.closest("input") && event.key.startsWith("Arrow")) return;

    switch (event.key.toLowerCase()) {
      case " ":
        // A focused button already handles Space itself.
        if (event.repeat || target?.closest(ownSpace)) return;
        actions.toggle();
        break;
      case "arrowleft":
        actions.sentence(-1);
        break;
      case "arrowright":
        actions.sentence(1);
        break;
      case "arrowup":
        actions.changeWpm(1);
        break;
      case "arrowdown":
        actions.changeWpm(-1);
        break;
      case "r":
        actions.restart();
        break;
      case "v":
        actions.openPaste();
        break;
      default:
        return;
    }

    event.preventDefault();
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);
}
