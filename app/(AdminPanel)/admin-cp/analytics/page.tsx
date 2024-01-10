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
      <div className="my-[25px] flex w-screen lg:h-auto flex-col short:justify-start lg:justify-center items-center">
        <div className="w-[100%] short:w-[100%] lg:w-[90%] short:h-[auto] lg:h-[18%] flex justify-center short:justify-center lg:justify-start mb-[20px] short:mb-[20px] lg:mb-[0px]">
          <div className="flex flex-col items-center short:flex lg:block">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-mainTheme">Monitor website performance</p>
          </div>
        </div>
        <div className="w-[90%] lg:h-[54vh] flex justify-evenly flex-col lg:flex-row gap-5 lg:gap-0">
          <div className="w-[100%] h-[250px] lg:h-[auto] lg:w-[700px]">
            <ChartVisitor />
          </div>
          <div className="w-[100%] h-[250px] lg:w-auto lg:h-auto flex justify-center">
            <GeneralData />
          </div>
        </div>
        <div className="w-[90%] lg:min-h-[30vh] flex justify-evenly flex-col lg:flex-row items-center lg:items-start">
          <div className="w-[220px] sm:w-[320px]">
            <ChartCountry />
          </div>
          <div className="w-[220px] sm:w-[320px]">
            <ChartDevice />
          </div>
          <div className="w-[220px] sm:w-[320px]">
            <ChartPage />
          </div>
        </div>
      </div>
    </main>
  );
}
