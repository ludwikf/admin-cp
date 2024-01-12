import Link from "next/link";
import React from "react";
import ReviewsMain from "@/app/ui/reviews/ReviewsMain";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";

export default async function Reviews({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { reviews } = await getDictionary(lang);
  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen lg:h-auto flex-col short:justify-start lg:justify-center items-center">
        <div className="w-[100%] short:w-[100%] lg:w-[90%] short:h-[auto] lg:h-[18%] flex justify-center short:justify-center lg:justify-start mb-[20px] short:mb-[20px] lg:mb-[0px]">
          <div className="flex flex-col items-center short:flex lg:block">
            <h1 className="text-3xl font-bold">{reviews.title}</h1>
            <p className="text-mainTheme mb-1">{reviews.description}</p>
            <Link
              href={"/playground"}
              className="text-[#888] hover:text-[#ccc]"
            >
              Go to playground
            </Link>
          </div>
        </div>
        <div className="w-[90%] h-[84%] flex flex-col items-end">
          <ReviewsMain locale={reviews} />
        </div>
      </div>
    </main>
  );
}
