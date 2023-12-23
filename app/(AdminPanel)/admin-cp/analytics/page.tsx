"use client";
import React, { useEffect, useState } from "react";
import {
  ChartVisitor,
  ChartCountry,
  ChartDevice,
  ChartPage,
  GeneralData,
} from "@/app/components/Chart";

export default function Analytics() {
  return (
    <main className="flex min-h-screen">
      <div className="w-screen flex my-[25px] justify-center items-center flex-col">
        <div className="w-[90%] h-[16vh] flex">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-mainTheme">Monitor your website performance</p>
          </div>
        </div>
        <div className="w-[90%] h-[54vh] flex justify-evenly">
          <div className="w-[700px]">
            <ChartVisitor />
          </div>
          <div>
            <GeneralData />
          </div>
        </div>
        <div className="w-[90%] h-[30vh] flex justify-evenly">
          <div className="w-[320px]">
            <ChartCountry />
          </div>
          <div className="w-[320px]">
            <ChartDevice />
          </div>
          <div className="w-[320px]">
            <ChartPage />
          </div>
        </div>
      </div>
    </main>
  );
}
