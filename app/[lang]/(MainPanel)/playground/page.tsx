import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import React from "react";
import PlaygroundMain from "@/app/ui/playground/PlaygroundMain";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";
import CustomLink from "@/app/components/CustomLink";

export default async function Playground({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { form } = await getDictionary(lang);

  return (
    <main className="max-w-screen min-h-[100dvh] flex justify-center overflow-hidden">
      <CustomLink
        href={`/`}
        lang={lang}
        className="absolute left-12 top-10 flex gap-0.5 hover:text-mainTheme tall:text-3xl"
      >
        <ArrowLeftIcon className="w-5 mr-1.5 tall:w-9" />
        {form.back}
      </CustomLink>

      <PlaygroundMain locale={form} lang={lang} />
    </main>
  );
}
