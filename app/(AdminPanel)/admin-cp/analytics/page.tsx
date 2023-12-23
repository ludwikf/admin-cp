"use client";
import React, { useEffect, useState } from "react";
import ChartCountry from "@/app/components/ChartCountry";

export default function Analytics() {
  const [visitors, setVisitors] = useState(null);

  const fetchVisitors = async () => {
    try {
      const res = await fetch(
        "https://plausible.io/api/v1/stats/aggregate?site_id=ludwikfaron.com&period=12mo&metrics=visitors",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PLAUSIBLE}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Plausible response error");
      }

      const data = await res.json();
      setVisitors(data.results.visitors.value);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <main className="flex min-h-screen">
      <div className="w-screen flex my-[25px] justify-center items-center flex-col">
        <div className="w-[90%] h-[16vh] flex">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-mainTheme">Monitor your website performance</p>
          </div>
        </div>
        <div className="w-[90%] h-[100vh] flex">
          <ChartCountry />
        </div>
      </div>
    </main>
  );
}
