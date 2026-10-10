import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const media = matchMedia(query);
  media.addEventListener("change", onChange);

  return () => media.removeEventListener("change", onChange);
};

/** `false` on the server and during hydration, then the visitor's setting. */
export const useReducedMotion = () =>
  useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => false,
  );
