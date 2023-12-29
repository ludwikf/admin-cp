"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useSession } from "next-auth/react";

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session }: any = useSession();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/posts");

      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = (query: string) => {
    if (query) {
      return posts.filter(
        (post) =>
          (post.title || "").toLowerCase().includes(query.toLowerCase()) ||
          (post.author || "").toLowerCase().includes(query.toLowerCase())
      );
    } else {
      return posts;
    }
  };
  const handleRefreshPosts = async () => {
    fetchPosts();
  };

  const deletePost = async (postId: any) => {
    const res = await fetch(`/api/delete-post?id=${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Session: JSON.stringify(session),
      },
    });
    if (res.ok) {
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen flex-col justify-center items-center">
        <div className="w-[90%] h-[16%] flex">
          <div>
            <h1 className="text-3xl font-bold">Posts</h1>
            <p className="text-mainTheme mb-1">Add content to your page</p>
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

            <Link
              href={"/admin-cp/posts/new-post"}
              className="bg-white text-black px-3 py-2 rounded-xl hover:brightness-50 transition-all mb-3"
            >
              Create post
            </Link>
          </div>
          <div className="w-full h-full relative">
            {isLoading && (
              <div className="absolute -translate-x-1/2 left-1/2 top-[75px]">
                <div className="w-24 h-24">
                  <LoadingSpinner />
                </div>
              </div>
            )}
            <table className="w-[100%]">
              <tbody className="trTable">
                <tr className="bg-[#ffa60040] h-10 font-bold w-[100%] select-none">
                  <td className="w-[30%] pl-10 rounded-s-3xl ">
                    <p className="w-[40px] cursor-pointer ">Image</p>
                  </td>
                  <td className="w-[30%] ">
                    <p className="w-[40px] cursor-pointer">Title</p>
                  </td>
                  <td className="w-[20%] ">
                    <p className="w-[80px] cursor-pointer ">Author</p>
                  </td>
                  <td className="w-[15%] ">
                    <p className="w-[80px] cursor-pointer ">Created At</p>
                  </td>
                  <td className="rounded-e-3xl">
                    <TrashIcon className="w-5 hidden" />
                  </td>
                </tr>
                {isLoading
                  ? null
                  : filterPosts(searchQuery).map((post) => (
                      <tr
                        key={post._id}
                        className="trTable h-[100px] rounded-3xl"
                      >
                        <td className="pl-3 rounded-s-3xl w-[70px] h-">
                          <div className="w-[150px] h-[80px] relative">
                            <Image
                              rel="stylesheet preload prefetch"
                              src={post.image}
                              alt="img"
                              width={0}
                              height={0}
                              sizes="100vw"
                              priority
                              className="rounded-xl object-cover object-left w-full h-full"
                            />
                          </div>
                        </td>
                        <td>{post.title}</td>
                        <td>{post.author}</td>
                        <td>{new Date().toLocaleDateString()}</td>
                        <td className="rounded-e-3xl">
                          <div className="flex gap-1">
                            <Link
                              rel="stylesheet"
                              href={`/admin-cp/posts/edit-post/${post._id}`}
                              className="cursor-pointer select-none hover:text-mainTheme"
                            >
                              <PencilSquareIcon className="w-5" />
                            </Link>
                            <TrashIcon
                              onClick={() => deletePost(post._id)}
                              className="w-5 cursor-pointer select-none hover:text-mainTheme"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
