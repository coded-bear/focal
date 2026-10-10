export const paths = {
  home: "/",
} as const;

/** Key caps shown in the UI. They are symbols, so they are not translated. */
export const shortcutKeys = {
  play: ["Space"],
  sentence: ["←", "→"],
  speed: ["↑", "↓"],
  restart: ["R"],
  paste: ["V"],
} as const;

/** Longest text the reader accepts, in characters. */
export const pasteLimit = 200_000;

export const pasteShortcuts = { apple: "⌘V", other: "Ctrl+V" } as const;
