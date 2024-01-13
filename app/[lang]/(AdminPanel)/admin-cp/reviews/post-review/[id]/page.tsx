import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import PostReviewMain from "@/app/ui/reviews/post-review/PostReviewMain";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";

export default async function PostReview({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { form } = await getDictionary(lang);
  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen flex-col justify-center items-center">
        <div className="w-[90%] h-[16%] flex items-center ">
          <Link
            href={`/${lang}/admin-cp/reviews`}
            className="hover:text-[#ccc] flex text-lg mt-5 lg:mt-0"
          >
            <ArrowLeftIcon className="w-6 mr-1" /> {form.back}
          </Link>
        </div>
        <div className="w-[90%] h-[84%] flex flex-col items-end">
          <PostReviewMain locale={form} lang={lang} />
        </div>
      </div>
    </main>
  );
}
