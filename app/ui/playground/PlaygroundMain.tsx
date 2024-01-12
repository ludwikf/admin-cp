"use client";
import {
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Rating from "@/app/components/Rating";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import PostImage from "@/app/components/PostImage";

export default function PlaygroundMain() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const initialRender = useRef(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const postIdsSet = useRef<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session, status }: any = useSession();

  const fetchPosts = async (page: number) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  if (status === "loading") {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 mt-[100px]">
      {posts.map((post, index) => (
        <div
          key={index}
          className="flex w-[90vw] sm:w-[80vw] lg:w-[60vw] tall:w-[60vw] h-[130px] sm:h-[200px] tall:h-[300px] bg-[#282828] rounded-xl overflow-hidden items-center"
        >
          <div className="ml-3 flex items-start w-[300px] tall:w-[500px] tall:max-w-[1000px] ">
            <div className="w-full h-[110px] sm:h-[180px] tall:h-[280px] relative flex justify-center items-center">
              <PostImage source={post.image} />
            </div>
          </div>
          <div className="mx-5 py-3 h-[100%] w-[80%] flex flex-col justify-between">
            <div>
              <div className="mb-2 font-bold text-lg sm:text-xl tall:text-4xl">
                {post.title}
              </div>
              <div className="hidden sm:block text-[#bbb] tall:text-2xl max-w-[400px] max-h-[75px] tall:max-w-[90%] tall:max-h-[160px] overflow-hidden">
                {post.content}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-sm sm:text-lg tall:text-3xl text-[#777] sm:text-white">
                {post.author}
              </p>
              <div className="w-[80px] sm:w-[130px] tall:w-[200px]">
                <Rating postId={post._id} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {!hasMore && (
        <div className="mb-4 py-4 ">
          <div className="text-center py-2 text-mainTheme border-t-2 border-mainTheme">
            No More Posts to Display
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
  );
}
