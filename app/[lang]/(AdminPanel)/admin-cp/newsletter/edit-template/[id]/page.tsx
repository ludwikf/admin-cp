import EditTemplateMain from "@/app/ui/newsletter/edit-template/EditTemplateMain";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";
import React from "react";

export default async function EditTemplate({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { form } = await getDictionary(lang);
  return (
    <main className="flex h-screen">
      <EditTemplateMain locale={form} />
    </main>
  );
}
