"use client";

import { useSyncExternalStore } from "react";

/* Tiny persisted store (localStorage + cross-tab sync), no dependencies. */
export function createPersistedStore<T>(key: string, initial: T) {
  let state = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const read = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) state = { ...initial, ...JSON.parse(raw) };
    } catch {
      /* storage blocked: keep defaults */
    }
  };

  const emit = () => listeners.forEach((l) => l());

  const set = (next: T | ((prev: T) => T)) => {
    read();
    state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    emit();
  };

  const subscribe = (l: () => void) => {
    listeners.add(l);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      hydrated = false;
      read();
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  };

  const get = () => {
    read();
    return state;
  };

  function useStore(): T;
  function useStore<S>(selector: (s: T) => S): S;
  function useStore<S>(selector?: (s: T) => S) {
    return useSyncExternalStore(
      subscribe,
      () => (selector ? selector(get()) : get()),
      () => (selector ? selector(initial) : initial),
    );
  }

  return { get, set, subscribe, useStore };
}

/** True after hydration; use to avoid rendering client-only values on the server. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
