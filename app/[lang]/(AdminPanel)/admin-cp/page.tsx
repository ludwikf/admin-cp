import { ChartVisitor, GeneralData } from "@/app/components/Chart";
import { CardSkeleton } from "@/app/components/Skeletons";
import Post from "@/app/ui/dashboard/Post";
import Review from "@/app/ui/dashboard/Review";
import User from "@/app/ui/dashboard/User";
import { Locale } from "@/i18n.config";
import { authOptions } from "@/libs/authOptions";
import { getDictionary } from "@/libs/dictionary";
import { getServerSession } from "next-auth/next";
import React, { Suspense } from "react";

export default async function Dashboard({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { dashboard } = await getDictionary(lang);
  const session: any = await getServerSession(authOptions);
  const username = session?.user?.username;
  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen lg:h-auto flex-col short:justify-start lg:justify-center items-center">
        <div className="w-[100%] short:w-[100%] lg:w-[90%] short:h-[auto] lg:h-[14%] flex justify-center short:justify-center lg:justify-start mb-[20px] short:mb-[20px] lg:mb-[0px]">
          <div className="flex flex-col items-center short:flex lg:block">
            <h1 className="text-3xl font-bold">
              {dashboard.title} {username}
            </h1>
            <p className="text-mainTheme">{dashboard.description}</p>
          </div>
        </div>
        <div className="w-[90%] short:h-auto lg:h-[45%] flex flex-col short:flex-col lg:flex-row mb-5 gap-5 short:gap-5 lg:gap-0 items-center">
          <div className="bg-secondTheme h-[250px] short:h-[250px] lg:h-[100%] w-[100%] sm:w-[75%] short:w-[75%] lg:w-[40%] rounded-3xl short:mr-0 lg:mr-5 flex justify-center items-center order-2 short:order-2 lg:order-1">
            <Suspense fallback={<CardSkeleton />}>
              <Post dict={dashboard} />
            </Suspense>
          </div>
          <div className="bg-secondTheme h-[250px] short:h-[250px] lg:h-[100%] w-[100%] sm:w-[75%] short:w-[75%] lg:w-[60%] rounded-3xl flex items-center justify-center order-1 short:order-1 lg:order-2">
            <div className="w-[90%] h-[90%]">
              <ChartVisitor locale={dashboard} lang={lang} />
            </div>
          </div>
        </div>
        <div className="w-[90%] h-[auto] short:h-[auto] lg:h-[45%] flex flex-col items-center short:flex-col lg:flex-row">
          <div className="bg-secondTheme h-[250px] short:h-[250px] lg:h-[100%] w-[100%] sm:w-[75%] short:w-[75%] lg:w-[40%] rounded-3xl short:mr-0 lg:mr-5 flex justify-center items-center">
            <Suspense fallback={<CardSkeleton />}>
              <Review dict={dashboard} />
            </Suspense>
          </div>

          <div className="w-[100%] short:w-[100%] lg:w-[60%] short:h-[auto] lg:h-[100%] rounded-3xl flex flex-col short:flex-col lg:flex-row items-center short:items-center lg:items-start gap-5 short:gap-5 lg:gap-0 mt-5 short:mt-5 lg:mt-0">
            <div className="bg-secondTheme h-[250px] short:h-[250px] lg:h-[100%] w-[100%] sm:w-[75%] short:w-[75%] lg:w-[55%] mb-5 short:mb-5 lg:mb-0  rounded-3xl short:mr-0 lg:mr-5 flex justify-center items-center">
              <Suspense fallback={<CardSkeleton />}>
                <User dict={dashboard} />
              </Suspense>
            </div>
            <div className="hidden short:hidden lg:flex bg-secondTheme w-[45%] h-[100%] rounded-3xl justify-center items-center">
              <Suspense fallback={<CardSkeleton />}>
                <GeneralData locale={dashboard} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
