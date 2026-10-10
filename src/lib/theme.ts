export const themeStorageKey = "focal-theme";

const darkQuery = "(prefers-color-scheme: dark)";

/** Runs in `<head>` before first paint, so the stored theme never flashes. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${themeStorageKey}");var d=t?t==="dark":matchMedia("${darkQuery}").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

const readStoredTheme = () => {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
};

/** Applies the stored choice, or the system preference when there is none. */
export function applyTheme() {
  const stored = readStoredTheme();
  const dark = stored ? stored === "dark" : matchMedia(darkQuery).matches;
  document.documentElement.classList.toggle("dark", dark);
}

export function storeTheme(dark: boolean) {
  try {
    localStorage.setItem(themeStorageKey, dark ? "dark" : "light");
  } catch {
    // Storage is unavailable: the choice lasts for this page only.
  }
  document.documentElement.classList.toggle("dark", dark);
}

export const isDarkTheme = () =>
  document.documentElement.classList.contains("dark");

/** Notifies when the theme class or the system preference changes. */
export function subscribeToTheme(onChange: () => void) {
  const media = matchMedia(darkQuery);
  const onSystemChange = () => {
    if (!readStoredTheme()) applyTheme();
  };
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, { attributeFilter: ["class"] });
  media.addEventListener("change", onSystemChange);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", onSystemChange);
  };
}
