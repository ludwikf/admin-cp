import React from "react";

import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";
import RegisterForm from "@/app/ui/register/RegisterForm";

export default async function Register({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { form } = await getDictionary(lang);
  return (
    <main className="h-[100dvh] w-[100dvw] flex justify-center items-center">
      <RegisterForm locale={form} />
    </main>
  );
}
