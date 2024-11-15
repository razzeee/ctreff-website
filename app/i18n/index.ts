import { de, enUS } from "date-fns/locale";
import "server-only";

const dictionaries: Record<string, () => Promise<{ [key: string]: string }>> = {
  en: () =>
    import("./locales/en/translations.json").then((module) => module.default),
  de: () =>
    import("./locales/de/translations.json").then((module) => module.default),
};

export const getTranslation = async (locale: string) => {
  return dictionaries[locale]();
};

export const getLocale = (locale: string) => {
  if (locale === "de") {
    return de;
  } else {
    return enUS;
  }
};
