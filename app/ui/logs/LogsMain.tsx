"use client";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function LogsMain() {
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

  const filterLogs = (): any[] => {
    let filteredLogs = logs;

    const uniqueLogs = filteredLogs.filter(
      (post, index) =>
        index === filteredLogs.findIndex((p) => p._id === post._id)
    );

    let sortedLogs: any = uniqueLogs;

    const reversedLogs = sortedLogs.reverse();

    return reversedLogs;
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
      <div className="bg-black w-[95%] h-[90%] rounded-xl flex justify-center items-start mb-1">
        <div
          ref={logContainerRef}
          className="w-[95%] h-[93%] flex flex-col gap-1 max-h-[480px] overflow-auto hideScrollbar mt-5"
          id="scrollableDiv"
        >
          <InfiniteScroll
            dataLength={reversedLogs.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center w-full mb-5">
                <div className="w-[50px] h-[50px] overflow-hidden">
                  <LoadingSpinner />
                </div>
              </div>
            }
            scrollableTarget="scrollableDiv"
            inverse={true}
          >
            {filterLogs().map((log, index) => {
              const logIndex = filterLogs().length - index - 1;

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor:
                      logIndex % 2 === 0 ? "#191919" : "transparent",
                  }}
                >
                  <p className=" overflow-x-hidden">
                    {new Date(log.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <span className="text-yellow-400"> {log.actionType} </span>
                    {log.user.email} {log.user.username} ::{" "}
                    <span
                      className={`inline-block
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
  );
}
