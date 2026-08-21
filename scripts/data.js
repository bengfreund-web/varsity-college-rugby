/* data.js — single source of truth for all JSON.
   Fetches each file once, caches the promise, and hands the same
   parsed object to every module that imports it. */

const FILES = ["config", "phases", "why", "momentum", "montana", "budget", "faq"];

let cache = null;

export function loadData() {
  if (cache) return cache;
  cache = Promise.all(
    FILES.map((name) =>
      fetch(`data/${name}.json`)
        .then((r) => {
          if (!r.ok) throw new Error(`Failed to load ${name}.json (${r.status})`);
          return r.json();
        })
        .then((json) => [name, json])
        .catch((err) => {
          console.error(err);
          return [name, null];
        })
    )
  ).then((entries) => Object.fromEntries(entries));
  return cache;
}

/* Small helpers shared across modules */

export function fmtMoney(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return "$" + Math.round(n).toLocaleString("en-US");
}

/* Round to nearest hundred, formatted. */
export function fmtHundred(value) {
  const n = Number(value) || 0;
  const rounded = Math.round(n / 100) * 100;
  return "$" + rounded.toLocaleString("en-US");
}

/* Resolve a dotted path like "hero.eyebrow" against an object. */
export function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}
