import React from "react";
import PostsMain from "@/app/ui/posts/PostsMain";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";
import CustomLink from "@/app/components/CustomLink";

export default async function Posts({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { posts } = await getDictionary(lang);
  return (
    <main className="flex h-[100dvh]">
      <div className="my-[25px] flex w-screen lg:h-auto flex-col short:justify-start lg:justify-center items-center">
        <div className="w-[100%] short:w-[100%] lg:w-[90%] short:h-[auto] lg:h-[16%] flex justify-center short:justify-center lg:justify-start mb-[20px] short:mb-[20px] lg:mb-[0px]">
          <div className="flex flex-col items-center short:flex lg:block">
            <h1 className="text-3xl font-bold">{posts.title}</h1>
            <p className="text-mainTheme mb-1">{posts.description}</p>
            <CustomLink
              href={`/playground`}
              lang={lang}
              className="text-[#888] hover:text-[#ccc]"
            >
              {posts.playground}
            </CustomLink>
          </div>
        </div>
        <div className="w-[90%] h-[84%] flex flex-col items-end">
          <PostsMain locale={posts} lang={lang} />
        </div>
      </div>
    </main>
  );
}
