"use client";
import React, { useEffect, useState } from "react";
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
  Bars3Icon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { CommandLineIcon } from "@heroicons/react/24/outline";
import { Locale } from "@/i18n.config";

export default function Navbar({
  locale,
  params: { lang },
}: {
  locale: any;
  params: { lang: Locale };
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expand, setExpand] = useState(false);
  const pathName = usePathname();
  const navbar = locale.navbar;
  const handleLogout = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await signOut();
        redirect(`/${lang}/`);
      } catch (error) {
        console.error("Error signing out:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleResize = () => {
    if (window.innerWidth >= 1024 && window.innerHeight > 600) {
      setExpand(true);
    } else {
      setExpand(false);
    }
  };

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const isActive = (href: any) => {
    return pathName === href ? "bg-mainTheme text-black" : "";
  };
  const isActive2 = (href: any) => {
    return pathName === href ? "text-mainTheme" : "";
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setExpand(false);
    }
  }, [pathName]);

  useEffect(() => {
    if (expand && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [expand]);

  return (
    <>
      <div
        className={`${expand ? "block" : "hidden"}
         shortnav:${
           expand ? "block" : "hidden"
         } w-[100dvw] h-[100dvh] lg:hidden shortnav:fixed fixed backdrop-blur-md z-10`}
        onClick={toggleExpand}
      ></div>
      <div className="absolute top-7 left-7 block shortnav:block lg:hidden">
        <Bars3Icon className="w-7 cursor-pointer" onClick={toggleExpand} />
      </div>
      <main
        className={`z-20 hidden lg:block absolute shortnav:absolute lg:static ${
          expand ? "w-[200px]" : "w-[50px]"
        } 
        ${expand ? "displayBlock" : "hidden"}
        h-[100dvh] float-left`}
      >
        <div
          className={`${
            expand ? "w-[200px] shortnav:w-[500px] " : "w-[50px]"
          } h-[100dvh] fixed bg-secondTheme shortnav:${
            expand ? "displayBlock" : "hidden"
          } flex flex-col list-none items-center rounded-r-2xl z-20`}
        >
          <div className="flex flex-col justify-between items-center h-[100dvh] w-[100%]">
            <div className="my-10 shortnav:my-1 -7 flex gap-2 items-center">
              <Bars3Icon
                className="w-7 cursor-pointer"
                onClick={toggleExpand}
              />
              <h1
                className={`${
                  expand ? "block" : "hidden"
                } font-bold text-[#888] text-xl select-none`}
              >
                Admin Panel
              </h1>
            </div>
            <div className="flex-1 flex flex-col shortnav:flex-row shortnav:w-[100%] shortnav:items-center shortnav:justify-center shortnav:flex-wrap h-[50%] gap-1 tallmd:gap-1.5">
              <Link
                href={`/${lang}/admin-cp`}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/${lang}/admin-cp`
                )}  ${
                  expand ? "w-[150px]" : "w-[36px]"
                } h-[35px] flex justify-start items-center rounded-xl`}
              >
                <div className={`flex ml-2`}>
                  <HomeIcon className="w-5 mr-1.5" />
                  <p className={`${expand ? "block" : "hidden"} select-none`}>
                    {navbar.dashboard}
                  </p>
                </div>
              </Link>
              <span className="my-2 tallmd:hidden"></span>
              <Link
                href={`/${lang}/admin-cp/users`}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/${lang}/admin-cp/users`
                )}  ${
                  expand ? "w-[150px]" : "w-[36px]"
                } h-[35px] flex justify-start items-center rounded-xl`}
              >
                <div className={`flex ml-2`}>
                  <UsersIcon className="w-5 mr-1.5" />
                  <p className={`${expand ? "block" : "hidden"} select-none`}>
                    {navbar.users}
                  </p>
                </div>
              </Link>
              <Link
                href={`/${lang}/admin-cp/posts`}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/${lang}/admin-cp/posts`
                )}  ${
                  expand ? "w-[150px]" : "w-[36px]"
                } h-[35px] flex justify-start items-center rounded-xl`}
              >
                <div className={`flex ml-2`}>
                  <BookOpenIcon className="w-5 mr-1.5" />
                  <p className={`${expand ? "block" : "hidden"} select-none`}>
                    {navbar.posts}
                  </p>
                </div>
              </Link>
              <Link
                href={`/${lang}/admin-cp/reviews`}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/${lang}/admin-cp/reviews`
                )}  ${
                  expand ? "w-[150px]" : "w-[36px]"
                } h-[35px] flex justify-start items-center rounded-xl`}
              >
                <div className={`flex ml-2`}>
                  <FireIcon className="w-5 mr-1.5" />
                  <p className={`${expand ? "block" : "hidden"} select-none`}>
                    {navbar.reviews}
                  </p>
                </div>
              </Link>
              <span className="my-2 tallmd:hidden"></span>
              <Link
                href={`/${lang}/admin-cp/newsletter`}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/${lang}/admin-cp/newsletter`
                )}  ${
                  expand ? "w-[150px]" : "w-[36px]"
                } h-[35px] flex justify-start items-center rounded-xl`}
              >
                <div className={`flex ml-2`}>
                  <NewspaperIcon className="w-5 mr-1.5" />
                  <p className={`${expand ? "block" : "hidden"} select-none`}>
                    {navbar.newsletter}
                  </p>
                </div>
              </Link>
              <Link
                href={`/${lang}/admin-cp/analytics`}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/${lang}/admin-cp/analytics`
                )}  ${
                  expand ? "w-[150px]" : "w-[36px]"
                } h-[35px] flex justify-start items-center rounded-xl`}
              >
                <div className={`flex ml-2`}>
                  <ChartBarIcon className="w-5 mr-1.5" />
                  <p className={`${expand ? "block" : "hidden"} select-none`}>
                    {navbar.analytics}
                  </p>
                </div>
              </Link>
              <Link
                href={`/${lang}/admin-cp/logs`}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/${lang}/admin-cp/logs`
                )}  ${
                  expand ? "w-[150px]" : "w-[36px]"
                } h-[35px] flex justify-start items-center rounded-xl`}
              >
                <div className={`flex ml-2`}>
                  <CommandLineIcon className="w-5 mr-1.5" />
                  <p className={`${expand ? "block" : "hidden"} select-none`}>
                    {navbar.logs}
                  </p>
                </div>
              </Link>
              <span className="mt-3 tallmd:hidden"></span>
              <Link
                href={`/${lang}/playground`}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  "/playground"
                )}  ${
                  expand ? "w-[150px]" : "w-[36px]"
                } h-[35px] flex justify-start items-center rounded-xl`}
              >
                <div className={`flex ml-2`}>
                  <CodeBracketIcon className="w-5 mr-1.5" />
                  <p className={`${expand ? "block" : "hidden"} select-none`}>
                    {navbar.playground}
                  </p>
                </div>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3 my-10">
              <Link
                className={`ml-1 flex hover:text-mainTheme ${
                  expand ? "w-[150px]" : "w-[26px]"
                } ${isActive2(`/${lang}/admin-cp/settings`)}`}
                href={`/${lang}/admin-cp/settings`}
              >
                <Cog6ToothIcon className="w-5 mr-1.5" />
                <p className={`${expand ? "block" : "hidden"} select-none`}>
                  {navbar.settings}
                </p>
              </Link>
              <button
                className={`ml-1 flex items-center hover:text-mainTheme ${
                  expand ? "w-[150px]" : "w-[26px]"
                } `}
                disabled={isSubmitting}
                onClick={handleLogout}
              >
                <ArrowLeftOnRectangleIcon className="w-5 mr-1.5" />
                <p className={`${expand ? "block" : "hidden"} select-none`}>
                  {navbar.logout}
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
