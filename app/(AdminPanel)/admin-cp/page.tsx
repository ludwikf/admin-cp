"use client";
import { ChartVisitor, GeneralData } from "@/app/components/Chart";
import React from "react";
import {
  SingleReview,
  SingleUser,
  SinglePost,
} from "@/app/components/Dashboard";

export default function Dashboard() {
  console.log("xd");
  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen md:h-auto flex-col md:justify-center items-center">
        <div className="w-[100%] md:w-[90%] md:h-[14%] flex justify-center lg:justify-start mb-[20px] md:mb-[0px]">
          <div className="flex flex-col items-center lg:block">
            <h1 className="text-3xl font-bold">
              {/* Hello {session?.user.username} */}
            </h1>
            <p className="text-mainTheme">dashboard</p>
          </div>
        </div>
        <div className="w-[90%] md:h-[45%] flex flex-col md:flex-row mb-5 gap-5 md:gap-0 items-center">
          <SinglePost />
          <div className="bg-secondTheme h-[250px] md:h-[100%] w-[100%] sm:w-[75%] md:w-[60%] rounded-3xl flex items-center justify-center order-1 md:order-2">
            <div className="w-[90%] h-[90%] ">{<ChartVisitor />}</div>
          </div>
        </div>
        <div className="w-[90%] h-[auto] md:h-[45%] flex flex-col items-center md:flex-row">
          <SingleReview />

          <div className="w-[100%] md:w-[60%] md:h-[100%] rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-0 mt-5 md:mt-0">
            <SingleUser />

            <div className="hidden md:flex bg-secondTheme w-[45%] h-[100%] rounded-3xl justify-center items-center">
              <GeneralData />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
