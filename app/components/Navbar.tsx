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
import { redirect, usePathname } from "next/navigation";
import { CommandLineIcon } from "@heroicons/react/24/outline";
import { Locale, i18n } from "@/i18n.config";
import CustomLink from "./CustomLink";
import GetLocale from "./GetLocale";

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
        redirect(`${GetLocale("/", lang)}`);
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
    const isDefaultLang = lang === i18n.defaultLocale;
    const path = isDefaultLang ? href : `/${lang}${href}`;
    return pathName === path ? "bg-mainTheme text-black" : "";
  };
  const isActive2 = (href: any) => {
    const isDefaultLang = lang === i18n.defaultLocale;
    const path = isDefaultLang ? href : `/${lang}${href}`;
    return pathName === path ? "text-mainTheme" : "";
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
              <CustomLink
                href={`/admin-cp`}
                lang={lang}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/admin-cp`
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
              </CustomLink>
              <span className="my-2 tallmd:hidden"></span>
              <CustomLink
                href={`/admin-cp/users`}
                lang={lang}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/admin-cp/users`
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
              </CustomLink>
              <CustomLink
                href={`/admin-cp/posts`}
                lang={lang}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/admin-cp/posts`
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
              </CustomLink>
              <CustomLink
                href={`/admin-cp/reviews`}
                lang={lang}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/admin-cp/reviews`
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
              </CustomLink>
              <span className="my-2 tallmd:hidden"></span>
              <CustomLink
                href={`/admin-cp/newsletter`}
                lang={lang}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/admin-cp/newsletter`
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
              </CustomLink>
              <CustomLink
                href={`/admin-cp/analytics`}
                lang={lang}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/admin-cp/analytics`
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
              </CustomLink>
              <CustomLink
                href={`/admin-cp/logs`}
                lang={lang}
                className={`hover:bg-mainTheme hover:text-black ${isActive(
                  `/admin-cp/logs`
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
              </CustomLink>
              <span className="mt-3 tallmd:hidden"></span>
              <CustomLink
                href={`/playground`}
                lang={lang}
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
              </CustomLink>
            </div>
            <div className="flex flex-col items-center gap-3 my-10">
              <CustomLink
                className={`ml-1 flex hover:text-mainTheme ${
                  expand ? "w-[150px]" : "w-[26px]"
                } ${isActive2(`/admin-cp/settings`)}`}
                href={`/admin-cp/settings`}
                lang={lang}
              >
                <Cog6ToothIcon className="w-5 mr-1.5" />
                <p className={`${expand ? "block" : "hidden"} select-none`}>
                  {navbar.settings}
                </p>
              </CustomLink>
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
