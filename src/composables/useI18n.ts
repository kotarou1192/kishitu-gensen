import { ref, watch } from "vue";
import {
  LOCALE_STORAGE_KEY,
  MESSAGES,
  translate,
  type Locale,
  type MessageKey,
} from "../lib/i18n";

const locale = ref<Locale>("ja");
let initialized = false;

const isLocale = (value: string | null): value is Locale => {
  return value === "ja" || value === "en";
};

const initLocale = () => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");
  const storedLang = localStorage.getItem(LOCALE_STORAGE_KEY);

  if (isLocale(urlLang)) {
    locale.value = urlLang;
    localStorage.setItem(LOCALE_STORAGE_KEY, urlLang);
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
    const params = new URLSearchParams(window.location.search);
    params.set("lang", next);
    const hash = window.location.hash;
    const nextUrl = `${window.location.pathname}?${params.toString()}${hash}`;
    window.history.replaceState({}, "", nextUrl);
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
