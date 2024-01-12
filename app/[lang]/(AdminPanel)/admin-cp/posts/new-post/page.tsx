import NewPostMain from "@/app/ui/posts/new-post/NewPostMain";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";
import React from "react";

export default async function NewPost({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { form } = await getDictionary(lang);

  return (
    <main className="flex h-screen">
      <NewPostMain locale={form} />
    </main>
  );
}
