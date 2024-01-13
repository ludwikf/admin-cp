import React from "next-auth/react";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";
import LoginForm from "@/app/ui/login/LoginForm";

export default async function Admincp({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { form } = await getDictionary(lang);

  return (
    <main className="h-[100dvh] w-[100dvw] flex justify-center items-center">
      <LoginForm locale={form} lang={lang} />
    </main>
  );
}
