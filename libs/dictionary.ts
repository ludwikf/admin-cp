import "server-only";

import type { Locale } from "@/i18n.config";

const dictionaries = {
  en: () =>
    import("@/dictionaries/en.json").then((module) => module.default as any),
  pl: () =>
    import("@/dictionaries/pl.json").then((module) => module.default as any),
};

export const getDictionary = async (locale: Locale) => {
  if (!(locale in dictionaries)) {
    throw new Error(`Locale '${locale}' not supported`);
  }
  try {
    const dictionary = await dictionaries[locale]();
    return dictionary as any; // Adjust the type as needed
  } catch (error) {
    console.error("Error loading dictionary:", error);
    throw new Error("Failed to load dictionary");
  }
};
