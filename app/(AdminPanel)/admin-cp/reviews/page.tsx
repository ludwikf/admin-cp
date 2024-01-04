"use client";
import {
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Rating from "@/app/components/Rating";

export default function Reviews() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const initialRender = useRef(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const postIdsSet = useRef<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async (page: number) => {
    try {
      const res = await fetch(`/api/get-posts?page=${page}`);
      if (res.ok) {
        const data: any[] = await res.json();
        if (data.length === 0) {
          setHasMore(false);
        } else {
          const uniquePosts = data.filter(
            (post) => !postIdsSet.current.has(post._id)
          );
          setPosts((prevPosts) => [...prevPosts, ...uniquePosts]);
          uniquePosts.forEach((post) => postIdsSet.current.add(post._id));
        }
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const fetchHandler = async () => {
    if (hasMore) {
      if (!initialRender.current) {
        try {
          await fetchPosts(page);
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
    setIsLoading(true);
    try {
      setPosts([]);
      setPage(1);
      setHasMore(true);
      setSearchQuery("");

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
                {filterPosts(searchQuery).map((post, index) => (
                  <Link
                    href={`/admin-cp/reviews/post-review/${post._id}`}
                    key={index}
                    className="flex w-[100%] h-[200px] bg-[#282828] rounded-xl overflow-hidden items-center hover:bg-[#222]"
                  >
                    <div className="ml-3 flex items-start w-[300px]">
                      <div className="w-[400px] h-[180px] relative">
                        <Image
                          src={post.image}
                          alt="img"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="left"
                          priority
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="ml-5 mr-5 h-[180px] w-[100%] flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-xl">{post.title}</div>
                        <div className="text-[#bbb] max-w-[400px] max-h-[75px] overflow-hidden">
                          {post.content}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-bold text-lg">{post.author}</p>
                        <Rating postId={post._id} readOnly={true} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {!hasMore && (
                <div className="mb-4 py-4 ">
                  <div className="text-center py-2 text-mainTheme border-t-2 border-mainTheme">
                    No More Posts to Display
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
