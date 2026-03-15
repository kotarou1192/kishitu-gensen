import { ref, watch } from "vue";
import { LOCALE_STORAGE_KEY, MESSAGES, translate, type Locale, type MessageKey } from "../lib/i18n";

const locale = ref<Locale>("ja");
let initialized = false;

const isLocale = (value: string | null | undefined): value is Locale => {
  return value === "ja" || value === "en";
};

const ensureTrailingSlash = (path: string) => {
  return path.endsWith("/") ? path : `${path}/`;
};

const getLocaleFromPathname = (pathname: string): Locale | null => {
  const base = ensureTrailingSlash(import.meta.env.BASE_URL || "/");
  const normalizedPath = ensureTrailingSlash(pathname);

  const relativePath =
    base !== "/" && normalizedPath.startsWith(base)
      ? normalizedPath.slice(base.length)
      : normalizedPath.replace(/^\/+/, "");

  const [firstSegment] = relativePath.split("/").filter(Boolean);
  return isLocale(firstSegment) ? firstSegment : null;
};

const getLocalePath = (next: Locale) => {
  const base = ensureTrailingSlash(import.meta.env.BASE_URL || "/");
  return `${base}${next}/`;
};

const initLocale = () => {
  if (typeof window === "undefined") return;

  const pathLocale = getLocaleFromPathname(window.location.pathname);
  const storedLang = localStorage.getItem(LOCALE_STORAGE_KEY);

  if (pathLocale) {
    locale.value = pathLocale;
    localStorage.setItem(LOCALE_STORAGE_KEY, pathLocale);
    return;
  }

  if (isLocale(storedLang)) {
    locale.value = storedLang;
    return;
  }

  const browserLang = navigator.language.toLowerCase();
  locale.value = browserLang.startsWith("ja") ? "ja" : "en";
};

export function useI18n() {
  if (!initialized) {
    initLocale();

    watch(locale, (next) => {
      if (typeof window === "undefined") return;
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    });

    initialized = true;
  }

  const setLocale = (next: Locale) => {
    locale.value = next;

    if (typeof window === "undefined") return;
    const nextPath = getLocalePath(next);
    const currentPath = ensureTrailingSlash(window.location.pathname);
    if (currentPath === ensureTrailingSlash(nextPath)) {
      return;
    }

    const query = window.location.search;
    const hash = window.location.hash;
    const nextUrl = `${nextPath}${query}${hash}`;
    window.location.assign(nextUrl);
  };

  const t = (key: MessageKey, params?: Record<string, string | number>) => {
    return translate(locale.value, key, params);
  };

  return {
    locale,
    setLocale,
    t,
    messages: MESSAGES,
  };
}
