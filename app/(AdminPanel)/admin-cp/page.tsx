"use client";
import { ChartPage, GeneralData } from "@/app/components/Chart";
import { useSession } from "next-auth/react";
import React from "react";

export default function Dashboard() {
  const { data: session, status }: any = useSession();
  if (status === "loading") {
    return null;
  }
  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen flex-col justify-center items-center">
        <div className="w-[90%] h-[14%] flex">
          <div>
            <h1 className="text-3xl font-bold">
              Hello {session.user.username}
            </h1>
            <p className="text-mainTheme">dashboard</p>
          </div>
        </div>
        <div className="w-[90%] h-[45%] flex mb-5">
          <div className="bg-secondTheme w-[40%] rounded-3xl mr-5"></div>
          <div className="bg-secondTheme w-[60%] rounded-3xl"></div>
        </div>
        <div className="w-[90%] h-[45%] flex">
          <div className="bg-secondTheme w-[40%] rounded-3xl mr-5"></div>
          <div className="w-[60%] rounded-3xl flex">
            <div className="bg-secondTheme w-[50%] h-[100%] rounded-3xl mr-5"></div>
            <div className="bg-secondTheme w-[50%] rounded-3xl"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
