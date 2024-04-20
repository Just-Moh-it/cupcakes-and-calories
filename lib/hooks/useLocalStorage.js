"use client";

import React from "react";

function dispatchStorageEvent(key, newValue) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}
const setLocalStorageItem = (key, value) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key) => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
};

const useLocalStorageSubscribe = (callback) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

export function useLocalStorage(initialValue) {
  const getSnapshot = () => getLocalStorageItem("items");

  const store = React.useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    () => {}
  );

  const setState = React.useCallback(
    (v) => {
      try {
        const nextState = typeof v === "function" ? v(JSON.parse(store)) : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem("items");
        } else {
          setLocalStorageItem("items", nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [store]
  );

  React.useEffect(() => {
    if (
      getLocalStorageItem("items") === null &&
      typeof initialValue !== "undefined"
    ) {
      setLocalStorageItem("items", initialValue);
    }
  }, [initialValue]);

  return [store ? JSON.parse(store) : initialValue, setState];
}
