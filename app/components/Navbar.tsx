"use client";
import React from "react";
import { signOut } from "next-auth/react";
import {
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  UsersIcon,
  NewspaperIcon,
  BookOpenIcon,
  ChartBarIcon,
  FireIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandLineIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const pathName = usePathname();

  const isActive = (href: any) => {
    return pathName === href ? "bg-mainTheme text-black" : "";
  };
  const isActive2 = (href: any) => {
    return pathName === href ? "text-mainTheme" : "";
  };
  return (
    <main className="w-[200px] h-screen float-left">
      <div className="fixed bg-secondTheme w-[200px] flex flex-col list-none items-center rounded-r-3xl">
        <div className="flex flex-col justify-between h-screen">
          <div className="my-10 ml-2">
            <h1 className="font-bold text-[#888] text-xl">Admin Panel</h1>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <Link
              href={"/admin-cp"}
              className={`hover:bg-mainTheme hover:text-black ${isActive(
                "/admin-cp"
              )}  w-[150px] h-[35px] flex justify-start items-center rounded-xl`}
            >
              <div className={`flex ml-2`}>
                <HomeIcon className="w-5 mr-1.5" />
                Dashboard
              </div>
            </Link>
            <span className="my-4"></span>
            <Link
              href={"/admin-cp/users"}
              className={`hover:bg-mainTheme hover:text-black ${isActive(
                "/admin-cp/users"
              )}  w-[150px] h-[35px] flex justify-start items-center rounded-xl`}
            >
              <div className={`flex ml-2`}>
                <UsersIcon className="w-5 mr-1.5" />
                Users
              </div>
            </Link>
            <Link
              href={"/admin-cp/posts"}
              className={`hover:bg-mainTheme hover:text-black ${isActive(
                "/admin-cp/posts"
              )}  w-[150px] h-[35px] flex justify-start items-center rounded-xl`}
            >
              <div className={`flex ml-2`}>
                <BookOpenIcon className="w-5 mr-1.5" />
                Posts
              </div>
            </Link>
            <Link
              href={"/admin-cp/reviews"}
              className={`hover:bg-mainTheme hover:text-black ${isActive(
                "/admin-cp/reviews"
              )}  w-[150px] h-[35px] flex justify-start items-center rounded-xl`}
            >
              <div className={`flex ml-2`}>
                <FireIcon className="w-5 mr-1.5" />
                Reviews
              </div>
            </Link>
            <span className="my-4"></span>
            <Link
              href={"/admin-cp/newsletter"}
              className={`hover:bg-mainTheme hover:text-black ${isActive(
                "/admin-cp/newsletter"
              )}  w-[150px] h-[35px] flex justify-start items-center rounded-xl`}
            >
              <div className={`flex ml-2`}>
                <NewspaperIcon className="w-5 mr-1.5" />
                Newsletter
              </div>
            </Link>
            <Link
              href={"/admin-cp/analytics"}
              className={`hover:bg-mainTheme hover:text-black ${isActive(
                "/admin-cp/analytics"
              )}  w-[150px] h-[35px] flex justify-start items-center rounded-xl`}
            >
              <div className={`flex ml-2`}>
                <ChartBarIcon className="w-5 mr-1.5" />
                Analytics
              </div>
            </Link>
            <Link
              href={"/admin-cp/logs"}
              className={`hover:bg-mainTheme hover:text-black ${isActive(
                "/admin-cp/logs"
              )}  w-[150px] h-[35px] flex justify-start items-center rounded-xl`}
            >
              <div className={`flex ml-2`}>
                <CommandLineIcon className="w-5 mr-1.5" />
                Logs
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-3 my-10 ml-2">
            <Link
              className={`flex hover:text-mainTheme w-[90px] ${isActive2(
                "/admin-cp/settings"
              )}`}
              href={"/admin-cp/settings"}
            >
              <Cog6ToothIcon className="w-5 mr-1.5" />
              Settings
            </Link>
            <button
              className="flex items-center hover:text-mainTheme w-[80px] "
              onClick={() => {
                signOut();
              }}
            >
              <ArrowLeftOnRectangleIcon className="w-5 mr-1.5" />
              Logout
            </button>
          </div>
          {/* <div className="my-10 flex flex-col gap-2 bg-white">
            <Link
              href={"/admin-cp/settings"}
              className={`flex hover:text-mainTheme ${isActive(
                "/admin-cp/settings"
              )} bg-secondTheme text-black`}
            >
              <Cog6ToothIcon className="w-5 mr-1.5" />
              Settings
            </Link>
            
          </div> */}
        </div>
      </div>
    </main>
  );
}
