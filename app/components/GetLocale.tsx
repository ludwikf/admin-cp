import { i18n } from "@/i18n.config";

export default function getLocale(href: string, lang: string) {
  const isDefaultLang = lang === i18n.defaultLocale;
  const path = isDefaultLang ? href : `/${lang}${href}`;
  return path;
}
