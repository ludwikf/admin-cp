"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowPathIcon,
  PencilSquareIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useSession } from "next-auth/react";

export default function Posts() {
  const [review, setReviews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session }: any = useSession();
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const initialRender = useRef(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  const fetchReviews = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/get-reviews-page?page=${page}`);

      if (!res.ok) {
        throw new Error("Error fetching reviews");
      }

      const data = await res.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setReviews((prevReviews) => [...prevReviews, ...data]);
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHandler = async () => {
    if (hasMore) {
      if (!initialRender.current) {
        try {
          await fetchReviews(page);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      } else {
        initialRender.current = false;
      }
    }
  };

  const filterReviews = (query: string) => {
    let filteredPosts = review;

    if (query) {
      filteredPosts = filteredPosts.filter(
        (review) =>
          (review.author || "").toLowerCase().includes(query.toLowerCase()) ||
          (review.comment || "").toLowerCase().includes(query.toLowerCase())
      );
    }
    const uniquePosts = filteredPosts.filter(
      (post, index) =>
        index === filteredPosts.findIndex((p) => p._id === post._id)
    );

    return uniquePosts;
  };

  const handleRefreshPosts = async () => {
    setIsLoading(true);
    try {
      setReviews([]);
      setPage(1);
      setHasMore(true);
      setSearchQuery("");
      setSortOrder("");
      setSortBy("");

      fetchHandler();
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } =
      document.documentElement || document.body;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const deletePost = async (postId: any) => {
    try {
      const res = await fetch(`/api/delete-post?id=${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Session: JSON.stringify(session),
        },
      });
      if (res.ok) {
        setReviews((prevPosts) =>
          prevPosts.filter((user) => user._id !== postId)
        );
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
          <div className="flex justify-between w-full ">
            <div className="flex items-center mb-3 gap-3 select-none">
              <button
                onClick={handleRefreshPosts}
                disabled={isLoading}
                className=" text-white rounded-full hover:brightness-50 transition-all rotate"
              >
                <ArrowPathIcon className="w-8" />
              </button>
              <div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=" bg-[#161616] rounded-3xl px-5 p-1.5 w-[200px] text-white focus:outline-none focus:ring-0 border-2 focus:border-mainTheme placeholder:text-[#666]"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-full relative">
            <div className="w-[100%]">
              <div className="flex flex-col gap-5">
                {filterReviews(searchQuery).map((rev, index) => (
                  <div
                    key={index}
                    className="bg-secondTheme min-h-[100px] rounded-xl flex flex-col justify-start"
                  >
                    <div className="flex justify-between mx-7 my-5">
                      <div>
                        <p className="text-xl font-bold mb-1">
                          {rev.user.username}
                        </p>
                        <p className="text-[#777]">
                          {new Date(rev.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((star, index) => {
                          const currentRating = index + 1;
                          return (
                            <label key={index}>
                              <input
                                type="radio"
                                name="rating"
                                value={currentRating}
                                className="hidden"
                              />
                              <StarIcon
                                className="w-[25px] cursor-pointer star"
                                color={
                                  currentRating <= rev.rating
                                    ? "#ffc107"
                                    : "#393939"
                                }
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    {rev.comment !== "" && (
                      <div className="flex justify-between mx-7 my-5">
                        <div>{rev.comment}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {!hasMore && (
                <div className="mb-4 py-4 ">
                  <div className="text-center py-2 text-mainTheme border-t-2 border-mainTheme">
                    No more reviews to display
                  </div>
                </div>
              )}
              {isLoading && hasMore && (
                <div>
                  <div className="w-full h-full relative">
                    <div className="w-[50px] h-[50px] absolute left-[50%] top-3 -translate-x-1/2">
                      <LoadingSpinner />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
