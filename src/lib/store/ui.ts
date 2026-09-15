"use client";

import { useSyncExternalStore } from "react";

type Ui = { cartOpen: boolean; menuOpen: boolean; planPicker: boolean };

let state: Ui = { cartOpen: false, menuOpen: false, planPicker: false };
const listeners = new Set<() => void>();

export const ui = {
  set(patch: Partial<Ui>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  get: () => state,
};

const serverState = state;

export function useUi<T>(selector: (s: Ui) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => selector(state),
    () => selector(serverState),
  );
}
