import React from "react";
import NewTemplateMain from "@/app/ui/newsletter/new-template/NewTemplateMain";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";

export default async function NewTemplate({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { form } = await getDictionary(lang);
  return (
    <main className="flex h-screen">
      <NewTemplateMain locale={form} />
    </main>
  );
}
