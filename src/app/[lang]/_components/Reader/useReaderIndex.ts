import { useSyncExternalStore } from "react";
import type { ReaderIndexStore } from "./Reader.types";

export const emptyStage = -1;

export function createReaderIndexStore(): ReaderIndexStore {
  const listeners = new Set<() => void>();
  let index = emptyStage;

  return {
    get: () => index,
    set: (next) => {
      if (next === index) return;
      index = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (onChange) => {
      listeners.add(onChange);

      return () => listeners.delete(onChange);
    },
  };
}

export const useReaderIndex = (store: ReaderIndexStore) =>
  useSyncExternalStore(store.subscribe, store.get, () => emptyStage);
