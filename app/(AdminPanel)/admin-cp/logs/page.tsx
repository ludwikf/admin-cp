"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Settings() {
  const [logs, setLogs] = useState<any[]>([]);
  const scrollContainerRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/get-logs");

      if (!res.ok) {
        throw new Error("Error fetching data");
      }

      const data = await res.json();
      setLogs(data);
      scrollToBottom();
    } catch (error: any) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchData();
    scrollToBottom();
  }, [logs]);

  return (
    <main className="flex min-h-screen">
      <div className="w-screen flex my-[25px] justify-center items-center flex-col">
        <div className="w-[90%] h-[16vh] flex">
          <div>
            <h1 className="text-3xl font-bold">Logs</h1>
            <p className="text-mainTheme mb-1">Track user actions</p>
          </div>
        </div>
        <div className="w-[90%] h-full flex flex-col items-start">
          <div className="bg-secondTheme w-full h-full rounded-3xl flex justify-center items-center">
            <div className="bg-black w-[95%] h-[90%] rounded-xl flex justify-center items-start">
              <div
                className="w-[95%] flex flex-col gap-1 max-h-[480px] overflow-auto hideScrollbar mt-5"
                ref={scrollContainerRef}
              >
                {logs.map((log) => (
                  <div key={log._id}>
                    <p>
                      {new Date(log.createdAt).toLocaleString()}
                      <span className="text-yellow-400">
                        {" "}
                        {log.actionType}{" "}
                      </span>
                      {log.user.email} {log.user.username} (
                      <span className="text-[#777]">{log.user.id}</span>) ::{" "}
                      {log.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
