"use client";
import {
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Rating from "@/app/components/Rating";

export default function Playground() {
  const [posts, setPosts] = useState<any[]>([]);
  const { data: session, status }: any = useSession();

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/get-posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleReviewSubmit = async () => {
    await fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
      </div>
    </main>
  );
}
