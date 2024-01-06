"use client";
import { ChartVisitor, GeneralData } from "@/app/components/Chart";
import { StarIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import PostImage from "@/app/components/PostImage";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [loading, isLoading] = useState<boolean>(false);

  const { data: session, status }: any = useSession();

  const fetchUser = async () => {
    isLoading(true);
    try {
      const res = await fetch("/api/get-user-new");
      if (!res.ok) {
        return new Error("Error fetching User");
      }
      const data = await res.json();
      setUser(data[0]);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      isLoading(false);
    }
  };
  const fetchPost = async () => {
    isLoading(true);
    try {
      const res = await fetch("/api/get-post-new");
      if (!res.ok) {
        return new Error("Error fetching Post");
      }
      const data = await res.json();
      setPost(data[0]);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      isLoading(false);
    }
  };
  const fetchReview = async () => {
    isLoading(true);
    try {
      const res = await fetch("/api/get-review-new");
      if (!res.ok) {
        return new Error("Error fetching User");
      }
      const data = await res.json();
      setReview(data[0]);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      isLoading(false);
    }
  };

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
          <span className="md">Today</span>
          <span className="mx-2">| </span>
          <span className="text-lg md:text-xl">
            {receivedDate.toLocaleTimeString([], timeOptions)}
          </span>
        </div>
      );
    } else if (receivedDate.toDateString() === yesterday.toDateString()) {
      return (
        <div className="text-[#999] flex items-center">
          <span className="md">Yesterday</span>
          <span className="mx-2">| </span>
          <span className="text-lg md:text-xl">
            {receivedDate.toLocaleTimeString([], timeOptions)}
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-[#999] flex items-center">
          <span className="md">{receivedDate.toLocaleDateString()}</span>
          <span className="mx-2">|</span>
          <span className="text-lg md:text-xl">
            {receivedDate.toLocaleTimeString([], timeOptions)}
          </span>
        </div>
      );
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPost();
    fetchReview();
  }, []);

  if (status === "loading") {
    return null;
  }
  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen md:h-auto flex-col md:justify-center items-center">
        <div className="w-[100%] md:w-[90%] md:h-[14%] flex justify-center lg:justify-start mb-[20px] md:mb-[0px]">
          <div className="flex flex-col items-center lg:block">
            <h1 className="text-3xl font-bold">
              Hello {session?.user.username}
            </h1>
            <p className="text-mainTheme">dashboard</p>
          </div>
        </div>
        <div className="w-[90%] md:h-[45%] flex flex-col md:flex-row mb-5 gap-5 md:gap-0 items-center">
          {loading ? (
            <div className="bg-secondTheme h-[250px] md:h-[100%] w-[100%] sm:w-[75%] md:w-[40%] rounded-3xl md:mr-5 flex justify-center items-center order-2 md:order-1">
              <div className="w-16 h-16 ">
                <LoadingSpinner />
              </div>
            </div>
          ) : (
            <div className="bg-secondTheme h-[250px] md:h-[100%] w-[100%] sm:w-[75%] md:w-[40%] rounded-3xl md:mr-5 flex justify-center items-center order-2 md:order-1">
              <div className="w-[85%] h-[85%] md:w-[80%] md:h-[80%] flex flex-col items-center md:items-start">
                <div className="flex flex-col items-center md:block">
                  <div className="text-xl md:text-3xl mb-3 xs:mb-6">
                    Latest Post
                  </div>
                  <div className="flex flex-col items-center xs:block">
                    <div className="flex flex-col xs:flex-row items-center md:mb-6 gap-3 min-h-[100px]">
                      {!loading && post?.image && (
                        <div className="w-[140px] h-[80px] relative">
                          <PostImage source={post.image} />
                        </div>
                      )}
                      <div className="flex flex-col items-center xs:block text-center xs:text-left">
                        <div className="text-md xs:text-xl md:text-2xl text-mainTheme mb-1">
                          {post?.title} dasasd dsaads
                        </div>
                        <div className="text-[#999] text-xs md:text-lg">
                          {post?.author}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs md:text-md">
                      {post?.createdAt && formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-secondTheme h-[250px] md:h-[100%] w-[100%] sm:w-[75%] md:w-[60%] rounded-3xl flex items-center justify-center order-1 md:order-2">
            <div className="w-[90%] h-[90%] ">
              <ChartVisitor />
            </div>
          </div>
        </div>
        <div className="w-[90%] h-[auto] md:h-[45%] flex flex-col items-center md:flex-row">
          {loading ? (
            <div className="bg-secondTheme h-[250px] md:h-[100%] w-[100%] sm:w-[75%] md:w-[40%] rounded-3xl md:mr-5 flex justify-center items-center">
              <div className="w-16 h-16 ">
                <LoadingSpinner />
              </div>
            </div>
          ) : (
            <div className="bg-secondTheme h-[250px] md:h-[100%] w-[100%] sm:w-[75%] md:w-[40%] rounded-3xl md:mr-5 flex justify-center items-center">
              <div className="w-[80%] h-[80%] flex flex-col items-start">
                <div className="flex flex-col items-center xs:block">
                  <div className="text-xl md:text-3xl mb-2 xs:mb-5">
                    Latest Review
                  </div>

                  <div className="flex flex-col items-center justify-center mb-5 gap-2 min-h-[100px]">
                    <div className="text-lg xs:text-2xl text-mainTheme mb-1">
                      {review?.comment}
                    </div>

                    <div className="w-full flex items-center justify-between">
                      <div>{review?.user.username}</div>
                      <div className="flex">
                        {[...Array(5)].map((star, index) => {
                          const currentRating = index + 1;
                          return (
                            <StarIcon
                              key={index}
                              className={`w-[20px] xs:w-[25px]`}
                              color={
                                currentRating <= review?.rating
                                  ? "#ffc107"
                                  : "#393939"
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div>{review?.createdAt && formatDate(review.createdAt)}</div>
                </div>
              </div>
            </div>
          )}
          <div className="w-[100%] md:w-[60%] md:h-[100%] rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-0 mt-5 md:mt-0">
            {loading ? (
              <div className="bg-secondTheme mb-5 md:mb-0 h-[250px] md:h-[100%] w-[100%] sm:w-[75%] md:w-[55%] rounded-3xl md:mr-5 flex justify-center items-center">
                <div className="w-16 h-16 ">
                  <LoadingSpinner />
                </div>
              </div>
            ) : (
              <div className="bg-secondTheme h-[250px] md:h-[100%] w-[100%] sm:w-[75%] md:w-[55%] mb-5 md:mb-0  rounded-3xl md:mr-5 flex justify-center items-center">
                <div className="w-[80%] h-[70%] flex flex-col items-center">
                  <div className="flex flex-col items-center xs:block">
                    <div className="text-xl md:text-3xl mb-3 xs:mb-6">
                      New User
                    </div>
                    <div className="flex items-center mb-6 gap-2">
                      <div>
                        <UserCircleIcon className="w-16 mt-1" />
                      </div>
                      <div>
                        <div className="text-xl xs:text-2xl text-mainTheme mb-1">
                          {user?.username}
                        </div>
                        <div className="text-sm xs:text-md">{user?.email}</div>
                      </div>
                    </div>
                    <div>{user?.createdAt && formatDate(user.createdAt)}</div>
                  </div>
                </div>
              </div>
            )}
            <div className="hidden md:flex bg-secondTheme w-[45%] h-[100%] rounded-3xl justify-center items-center">
              <GeneralData />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
