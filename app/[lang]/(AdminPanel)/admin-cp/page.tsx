import { ChartVisitor, GeneralData } from "@/app/components/Chart";
import PostImage from "@/app/components/PostImage";
import { Locale } from "@/i18n.config";
import { authOptions } from "@/libs/authOptions";
import { getDictionary } from "@/libs/dictionary";
import { StarIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { getServerSession } from "next-auth/next";
import React from "react";

async function fetchUser() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEB_URL}/api/get-user-new`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    return null;
  }
}
async function fetchReview() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEB_URL}/api/get-review-new`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    return null;
  }
}
async function fetchPost() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEB_URL}/api/get-post-new`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function Dashboard({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { dashboard } = await getDictionary(lang);
  const session: any = await getServerSession(authOptions);
  const username = session?.user?.username;
  const formatDate = (dateString: string) => {
    const currentDate = new Date();
    const receivedDate = new Date(dateString);

    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const yesterday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 1
    );

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
    };

    if (receivedDate.toDateString() === today.toDateString()) {
      return (
        <div className="text-[#999] flex items-center">
          <span className="md">{dashboard.today}</span>
          <span className="mx-2">| </span>
          <span className="text-lg lg:text-xl">
            {receivedDate.toLocaleTimeString([], timeOptions)}
          </span>
        </div>
      );
    } else if (receivedDate.toDateString() === yesterday.toDateString()) {
      return (
        <div className="text-[#999] flex items-center">
          <span className="md">{dashboard.yesterday}</span>
          <span className="mx-2">| </span>
          <span className="text-lg lg:text-xl">
            {receivedDate.toLocaleTimeString([], timeOptions)}
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-[#999] flex items-center">
          <span className="md">{receivedDate.toLocaleDateString()}</span>
          <span className="mx-2">|</span>
          <span className="text-lg lg:text-xl">
            {receivedDate.toLocaleTimeString([], timeOptions)}
          </span>
        </div>
      );
    }
  };
  const user = await fetchUser();
  const review = await fetchReview();
  const post = await fetchPost();
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
            <div className="w-[85%] h-[85%] short:w-[85%] lg:w-[80%] short:h-[85%] lg:h-[80%] flex flex-col items-center short:items-center lg:items-start">
              <div className="flex flex-col items-center short:flex lg:block">
                <div className="text-xl short:text-xl lg:text-2xl mb-3 xs:mb-6">
                  {dashboard.post.title}
                </div>
                <div className="flex flex-col items-center xs:block">
                  <div className="flex flex-col xs:flex-row items-center short:mb-0 lg:mb-6 gap-3 min-h-[100px]">
                    <div className="w-[110px] h-[60px] xs:w-[140px] xs:h-[80px] relative flex justify-center">
                      <PostImage source={post[0].image} />
                    </div>

                    <div className="flex flex-col items-center xs:block text-center xs:text-left">
                      <div className="text-lg xs:text-xl short:text-lg lg:text-2xl text-mainTheme mb-1">
                        {post[0]?.title}
                      </div>
                      <div className="text-[#777] text-xs short:text-xs lg:text-lg">
                        {post[0]?.author}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs short:text-xs lg:text-lg">
                    {post[0]?.createdAt && formatDate(post[0].createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-secondTheme h-[250px] short:h-[250px] lg:h-[100%] w-[100%] sm:w-[75%] short:w-[75%] lg:w-[60%] rounded-3xl flex items-center justify-center order-1 short:order-1 lg:order-2">
            <div className="w-[90%] h-[90%]">
              <ChartVisitor locale={dashboard} lang={lang} />
            </div>
          </div>
        </div>
        <div className="w-[90%] h-[auto] short:h-[auto] lg:h-[45%] flex flex-col items-center short:flex-col lg:flex-row">
          <div className="bg-secondTheme h-[250px] short:h-[250px] lg:h-[100%] w-[100%] sm:w-[75%] short:w-[75%] lg:w-[40%] rounded-3xl short:mr-0 lg:mr-5 flex justify-center items-center">
            <div className="w-[80%] h-[80%] flex flex-col items-center">
              <div className="flex flex-col items-center xs:block">
                <div className="text-xl short:text-xl lg:text-2xl mb-2 xs:mb-5">
                  {dashboard.review.title}
                </div>

                <div className="flex flex-col items-center justify-center mb-5 gap-2 min-h-[100px]">
                  <div className="text-lg xs:text-2xl text-mainTheme mb-1">
                    {review[0]?.comment}
                  </div>

                  <div className="w-full flex items-center justify-between">
                    <div className="mt-0.5 mr-2">
                      {review[0]?.user.username}
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((star, index) => {
                        const currentRating = index + 1;
                        return (
                          <StarIcon
                            key={index}
                            className={`w-[20px] xs:w-[25px]`}
                            color={
                              currentRating <= review[0]?.rating
                                ? "#ffc107"
                                : "#393939"
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div>
                  {review[0]?.createdAt && formatDate(review[0].createdAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[100%] short:w-[100%] lg:w-[60%] short:h-[auto] lg:h-[100%] rounded-3xl flex flex-col short:flex-col lg:flex-row items-center short:items-center lg:items-start gap-5 short:gap-5 lg:gap-0 mt-5 short:mt-5 lg:mt-0">
            <div className="bg-secondTheme h-[250px] short:h-[250px] lg:h-[100%] w-[100%] sm:w-[75%] short:w-[75%] lg:w-[55%] mb-5 short:mb-5 lg:mb-0  rounded-3xl short:mr-0 lg:mr-5 flex justify-center items-center">
              <div className="w-[80%] h-[70%] flex flex-col items-center">
                <div className="flex flex-col items-center xs:block">
                  <div className="text-xl short:text-xl lg:text-2xl mb-3 xs:mb-6">
                    {dashboard.user.title}
                  </div>
                  <div className="flex items-center mb-6 gap-2">
                    <div>
                      <UserCircleIcon className="w-16 mt-1" />
                    </div>
                    <div>
                      <div className="text-xl xs:text-2xl text-mainTheme mb-1">
                        {user[0]?.username}
                      </div>
                      <div className="text-sm xs:text-md">{user[0]?.email}</div>
                    </div>
                  </div>
                  <div>
                    {user[0]?.createdAt && formatDate(user[0].createdAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden short:hidden lg:flex bg-secondTheme w-[45%] h-[100%] rounded-3xl justify-center items-center">
              <GeneralData locale={dashboard} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
