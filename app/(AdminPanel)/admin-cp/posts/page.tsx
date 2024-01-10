"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useSession } from "next-auth/react";
import PostImage from "@/app/components/PostImage";

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session }: any = useSession();
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const initialRender = useRef(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  const fetchPosts = async (page: number) => {
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
          await fetchPosts(page);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      } else {
        initialRender.current = false;
      }
    }
  };

  const toggleSortOrder = (columnName: string) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortBy(columnName);
  };

  const sortByColumn = (columnName: string, usersArray: any[]) => {
    return usersArray.sort((a, b) => {
      const valueA = (a[columnName] || "").toLowerCase();
      const valueB = (b[columnName] || "").toLowerCase();

      if (sortOrder === "asc") {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
      } else {
        if (valueA > valueB) return -1;
        if (valueA < valueB) return 1;
      }
      return 0;
    });
  };

  const sortByCreatedAt = (usersArray: any[]) => {
    return usersArray.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "asc") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
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

    if (sortBy === "createdAt") {
      return sortByCreatedAt(uniquePosts);
    }
    return sortByColumn(sortBy, uniquePosts);
  };

  const handleRefreshPosts = async () => {
    setIsLoading(true);
    try {
      setPosts([]);
      setPage(1);
      setHasMore(true);
      setSearchQuery("");
      setSortOrder("");
      setSortBy("");
      initialRender.current = true;

      fetchHandler();
    } catch (error) {
      throw new Error("Error refreshing posts");
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
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/delete-post?id=${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Session: JSON.stringify(session),
        },
      });
      if (res.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((user) => user._id !== postId)
        );
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsSubmitting(false);
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
    <main className="flex h-[100dvh]">
      <div className="my-[25px] flex w-screen lg:h-auto flex-col short:justify-start lg:justify-center items-center">
        <div className="w-[100%] short:w-[100%] lg:w-[90%] short:h-[auto] lg:h-[16%] flex justify-center short:justify-center lg:justify-start mb-[20px] short:mb-[20px] lg:mb-[0px]">
          <div className="flex flex-col items-center short:flex lg:block">
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
        <div className="w-[90%] h-auto lg:h-[84%] flex flex-col items-end">
          <div className="flex justify-between w-full ">
            <div className="flex items-center mb-3 gap-1.5 xs:gap-3 select-none">
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
                  className="  bg-[#161616] rounded-3xl px-5 p-1.5 mr-2 xs:mr-0 w-[180px] xs:w-[200px] text-white focus:outline-none focus:ring-0 border-2 focus:border-mainTheme placeholder:text-[#666]"
                />
              </div>
            </div>

            <Link
              href={"/admin-cp/posts/new-post"}
              className="text-center xs:bg-white xs:text-black xs:px-3 xs:py-2 rounded-full xs:rounded-xl hover:brightness-50 transition-all mb-3"
            >
              <span className="hidden xs:block">Add new</span>
              <span className="xs:hidden">
                <PlusCircleIcon className="w-10" />
              </span>
            </Link>
          </div>
          <div
            className="w-full h-full relative overflow-x-auto lg:overflow-x-hidden hideScrollbar"
            onScroll={handleScroll}
          >
            <table className="w-[100%]">
              <tbody className="trTable">
                <tr className="bg-[#ffa60040] h-10 font-bold w-[100%] select-none">
                  <td className="min-w-[200px] lg:w-[30%] pl-10 rounded-s-3xl ">
                    <p className="w-[40px]">Image</p>
                  </td>
                  <td className="min-w-[300px] lg:w-[30%] ">
                    <p
                      onClick={() => {
                        toggleSortOrder("title");
                      }}
                      className="w-[40px] cursor-pointer"
                    >
                      Title
                    </p>
                  </td>
                  <td className="min-w-[150px] lg:w-[20%] ">
                    <p
                      onClick={() => {
                        toggleSortOrder("author");
                      }}
                      className="w-[80px] cursor-pointer "
                    >
                      Author
                    </p>
                  </td>
                  <td className="min-w-[120px] lg:w-[15%]">
                    <p
                      onClick={() => {
                        toggleSortOrder("createdAt");
                      }}
                      className="min-w-[120px] lg:w-[30%] cursor-pointer "
                    >
                      Created At
                    </p>
                  </td>
                  <td className="min-w-[80px] lg:w-auto rounded-e-3xl">
                    <TrashIcon className="w-5 hidden" />
                  </td>
                </tr>
                {filterPosts(searchQuery).map((post, index) => (
                  <tr key={index} className="trTable h-[100px] rounded-3xl">
                    <td className="pl-3 rounded-s-3xl w-[70px] h-">
                      <div className="w-[150px] h-[80px] relative flex justify-center items-center">
                        <PostImage source={post.image} />
                      </div>
                    </td>
                    <td>{post.title}</td>
                    <td>{post.author}</td>
                    <td>
                      {new Date(post.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="rounded-e-3xl">
                      <div className="flex gap-5 lg:gap-1">
                        <Link
                          rel="stylesheet"
                          href={`/admin-cp/posts/edit-post/${post._id}`}
                          className="cursor-pointer select-none hover:text-mainTheme"
                        >
                          <PencilSquareIcon className="w-6 lg:w-5" />
                        </Link>
                        <TrashIcon
                          onClick={() => deletePost(post._id)}
                          className={`w-6 lg:w-5 cursor-pointer select-none hover:text-mainTheme ${
                            isSubmitting ? "pointer-events-none" : ""
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {!hasMore && (
                  <tr className="mb-4 py-4 hidden lg:table-row">
                    <td
                      colSpan={5}
                      className="text-center py-2 text-mainTheme border-t-2 border-mainTheme"
                    >
                      No more users to display
                    </td>
                  </tr>
                )}
                {isLoading && hasMore && (
                  <tr className="hidden lg:table-row">
                    <td colSpan={5} className="w-full h-full relative">
                      <div className="w-[50px] h-[50px] absolute left-[50%] top-3 -translate-x-1/2">
                        <LoadingSpinner />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {!hasMore && (
          <div className="w-[90%] mb-4 py-4 lg:hidden">
            <div className="text-center py-2 text-mainTheme border-t-2 border-mainTheme">
              No More Posts to Display
            </div>
          </div>
        )}
        {isLoading && hasMore && (
          <div className="lg:hidden">
            <div className="w-full h-full relative">
              <div className="w-[50px] h-[50px] absolute left-[50%] top-3 -translate-x-1/2">
                <LoadingSpinner />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
