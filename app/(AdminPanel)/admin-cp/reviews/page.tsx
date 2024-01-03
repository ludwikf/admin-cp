"use client";
import Link from "next/link";
import React from "react";
import Rating from "@/app/components/Rating";

export default function Reviews() {
  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen flex-col justify-center items-center">
        <div className="w-[90%] h-[16%] flex">
          <div>
            <h1 className="text-3xl font-bold">Reviews</h1>
            <p className="text-mainTheme mb-1">Manage user feedback</p>
            <Link
              href={"/playground"}
              className="text-[#888] hover:text-[#ccc]"
            >
              Go to playground
            </Link>
          </div>
        </div>
        <div className="w-[90%] h-[84%] flex flex-col items-end">
          <div className="flex justify-between w-full "></div>
        </div>
      </div>
    </main>
  );
}
