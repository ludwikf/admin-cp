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

export default function Playground() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const initialRender = useRef(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const postIdsSet = useRef<Set<string>>(new Set());

  const { data: session, status }: any = useSession();

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
    <main className="max-w-screen min-h-screen flex justify-center overflow-hidden">
      {!session && (
        <Link
          href={"/"}
          className="absolute left-12 top-10 flex gap-0.5 hover:text-mainTheme"
        >
          <ArrowRightOnRectangleIcon className="w-5 mr-1.5" />
          Log in
        </Link>
      )}

      {session && session.user.role != "admin" && (
        <button
          className="absolute left-12 top-10 flex gap-0.5 hover:text-mainTheme"
          onClick={() => {
            signOut();
          }}
        >
          <ArrowLeftOnRectangleIcon className="w-5 mr-1.5" />
          Log out
        </button>
      )}

      {session && session.user.role === "admin" && (
        <Link
          href="/admin-cp/posts"
          className="absolute left-12 top-10 flex gap-0.5"
        >
          <ArrowLeftIcon className="w-4" /> Admin Panel
        </Link>
      )}

      <div className="flex flex-col gap-5 mt-[100px]">
        {posts.map((post, index) => (
          <div
            key={index}
            className="flex w-[50vw] h-[200px] bg-[#282828] rounded-xl overflow-hidden items-center"
          >
            <div className="ml-3 flex items-start w-[300px]">
              <div className="w-full h-[180px] relative">
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
            <div className="ml-5 mr-5 h-[180px] w-[400px] flex flex-col justify-between">
              <div>
                <div className="font-bold text-xl">{post.title}</div>
                <div className="text-[#bbb] max-w-[400px] max-h-[75px] overflow-hidden">
                  {post.content}
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-lg">{post.author}</p>
                <Rating postId={post._id} />
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
      </div>
    </main>
  );
}
