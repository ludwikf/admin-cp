import React from "react";
import EditPostMain from "@/app/ui/posts/edit-post/EditPostMain";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";

export default async function EditPost({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { form } = await getDictionary(lang);
  return (
    <main className="flex h-screen">
      <EditPostMain locale={form} />
    </main>
  );
}
