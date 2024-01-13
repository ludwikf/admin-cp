"use client";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import Rating from "@/app/components/Rating";
import PostImage from "@/app/components/PostImage";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function ReviewsMain({ locale, lang }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const initialRender = useRef(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReviews = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/get-posts?page=${page}`);

      if (!res.ok) {
        throw new Error("Error fetching posts");
      }

      const data = await res.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
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

  const filterPosts = (query: string) => {
    let filteredPosts = posts;

    if (query) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          (post.title || "").toLowerCase().includes(query.toLowerCase()) ||
          (post.author || "").toLowerCase().includes(query.toLowerCase())
      );
    }
    const uniquePosts = filteredPosts.filter(
      (post, index) =>
        index === filteredPosts.findIndex((p) => p._id === post._id)
    );

    return uniquePosts;
  };

  const handleRefreshPosts = async () => {
    window.location.reload();
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } =
      document.documentElement || document.body;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prevPage) => prevPage + 1);
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
    <>
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
              placeholder={`${locale.search}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" bg-[#161616] rounded-3xl px-4 p-1.5 w-[180px] xs:w-[200px] text-white focus:outline-none focus:ring-0 border-2 focus:border-mainTheme placeholder:text-[#666]"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-full relative">
        <div className="w-[100%]">
          <div className="flex flex-col gap-5">
            {filterPosts(searchQuery).map((post, index) => (
              <Link
                href={`/${lang}/admin-cp/reviews/post-review/${post._id}`}
                key={index}
                className="flex w-[100%] h-[200px] bg-[#282828] rounded-xl overflow-hidden items-center hover:bg-[#222]"
              >
                <div className="ml-3 hidden md:flex items-start w-[300px]">
                  <div className="lg:flex w-[400px] h-[180px] justify-center items-center">
                    <PostImage source={post.image} />
                  </div>
                </div>
                <div className="ml-5 mr-5 h-[180px] w-[100%] flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-lg xs:text-xl">
                      {post.title}
                    </div>
                    <div className="text-[#bbb] text-md max-w-[400px] max-h-[75px] overflow-hidden">
                      {post.content}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-bold text-lg">{post.author}</p>
                    <div className="w-[120px]">
                      <Rating postId={post._id} readOnly={true} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {!hasMore && (
            <div className="mb-4 py-4 ">
              <div className="text-center py-2 text-mainTheme border-t-2 border-mainTheme">
                {locale.noMore}
              </div>
            </div>
          )}
          {isLoading && hasMore && (
            <div className="">
              <div className="w-full h-full relative">
                <div className="w-[50px] h-[50px] absolute left-[50%] top-3 -translate-x-1/2">
                  <LoadingSpinner />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
