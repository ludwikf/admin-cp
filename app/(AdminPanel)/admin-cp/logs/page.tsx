"use client";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const initialRender = useRef(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  const fetchData = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/get-logs?page=${pageNumber}`);

      if (!res.ok) {
        throw new Error("Error fetching logs");
      }

      const data = (await res.json()) as any[];
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setLogs((prevLogs) => [...prevLogs, ...data]);
        setPage(page + 1);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const fetchHandler = () => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      fetchData(page);
    }
  };

  const refreshLogs = async () => {
    setIsLoading(true);
    try {
      setLogs([]);
      setPage(1);
      setHasMore(true);

      fetchHandler();
    } catch (error) {
      console.error("Error refreshing logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreData = () => {
    if (!isLoading) {
      fetchData(page);
    }
  };

  useEffect(() => {
    if (!initialFetchComplete) {
      fetchHandler();
      setInitialFetchComplete(true);
    }
  }, []);

  useEffect(() => {
    if (initialFetchComplete) {
      fetchHandler();
    }
  }, [page, initialFetchComplete]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const reversedLogs = [...logs].reverse();

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
          <div className="bg-secondTheme w-full h-full rounded-3xl flex flex-col justify-center items-center">
            <div>
              <button
                onClick={refreshLogs}
                disabled={isLoading}
                className="text-white rounded-full hover:brightness-50 transition-all rotate"
              >
                <ArrowPathIcon className="w-8" />
              </button>
            </div>
            <div className="bg-black w-[95%] h-[90%] rounded-xl flex justify-center items-start">
              <div
                ref={logContainerRef}
                className="w-[95%] flex flex-col gap-1 max-h-[480px] overflow-auto hideScrollbar mt-5"
                id="scrollableDiv"
              >
                <InfiniteScroll
                  dataLength={reversedLogs.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={
                    <div className="w-full flex justify-center">
                      <div className="w-[50px] h-[50px] overflow-hidden">
                        <LoadingSpinner />
                      </div>
                    </div>
                  }
                  scrollableTarget="scrollableDiv"
                  inverse={true}
                >
                  {reversedLogs.map((log, index) => {
                    const logIndex = reversedLogs.length - index - 1;

                    return (
                      <div
                        key={index}
                        style={{
                          backgroundColor:
                            logIndex % 2 === 0 ? "#191919" : "transparent",
                        }}
                      >
                        <p>
                          {new Date(log.createdAt).toLocaleString()}
                          <span className="text-yellow-400">
                            {" "}
                            {log.actionType}{" "}
                          </span>
                          (<span className="text-[#777]">{log.user.id}</span>){" "}
                          {log.user.email} {log.user.username} ::{" "}
                          <span
                            className={`
                          ${
                            log.details.includes("created") ||
                            log.details.includes("send") ||
                            log.details.includes("registration")
                              ? "text-green-400"
                              : log.details.includes("deleted")
                              ? "text-red-400"
                              : log.details.includes("modified")
                              ? "text-yellow-400"
                              : ""
                          }
                        `}
                          >
                            {log.details}
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
