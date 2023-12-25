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
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathName = usePathname();

  const isActive = (href: any) => {
    return pathName === href ? "text-mainTheme" : "";
  };
  return (
    <main className="w-[200px] h-screen float-left">
      <div className="fixed bg-secondTheme w-[200px] flex flex-col list-none items-center rounded-r-3xl">
        <div className="flex flex-col justify-between h-screen">
          <div className="my-10">
            <h1 className="font-bold text-lg">Admin Panel</h1>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Link
              href={"/admin-cp"}
              className={`flex hover:text-mainTheme ${isActive("/admin-cp")} `}
            >
              <HomeIcon className="w-5 mr-1.5" />
              Dashboard
            </Link>
            <Link
              href={"/admin-cp/analytics"}
              className={`mb-4 flex hover:text-mainTheme ${isActive(
                "/admin-cp/analytics"
              )} `}
            >
              <ChartBarIcon className="w-5 mr-1.5" />
              Analytics
            </Link>
            <Link
              href={"/admin-cp/users"}
              className={`flex hover:text-mainTheme ${isActive(
                "/admin-cp/users"
              )} `}
            >
              <UsersIcon className="w-5 mr-1.5" />
              Users
            </Link>
            <Link
              href={"/admin-cp/posts"}
              className={`flex hover:text-mainTheme ${isActive(
                "/admin-cp/posts"
              )} `}
            >
              <BookOpenIcon className="w-5 mr-1.5" />
              Posts
            </Link>
            <Link
              href={"/admin-cp/newsletter"}
              className={`flex hover:text-mainTheme ${isActive(
                "/admin-cp/newsletter"
              )} `}
            >
              <NewspaperIcon className="w-5 mr-1.5" />
              Newsletter
            </Link>
          </div>
          <div className="my-10 flex flex-col gap-2">
            <li className="flex">
              <Cog6ToothIcon className="w-5 mr-1.5" />
              Settings
            </li>
            <button
              className="flex items-center hover:text-mainTheme"
              onClick={() => {
                signOut();
              }}
            >
              <ArrowLeftOnRectangleIcon className="w-5 mr-1.5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
