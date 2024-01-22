"use client";
import Link from "next/link";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { i18n } from "@/i18n.config";

export default function UserProfile() {
  const { data: session, status }: any = useSession();
  const pathname = usePathname();

  const redirectedPathName = (locale: string) => {
    if (!pathname) return "/";
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );
    if (pathnameIsMissingLocale) {
      if (locale === i18n.defaultLocale) return pathname;
      return `/${locale}${pathname}`;
    } else {
      if (locale === i18n.defaultLocale) {
        const segments = pathname.split("/");
        const isHome = segments.length === 2;
        if (isHome) return "/";

        segments.splice(1, 1);
        return segments.join("/");
      }

      const segments = pathname.split("/");
      segments[1] = locale;
      return segments.join("/");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("logouting");
      await signOut();
    } catch (error) {
      console.log(error);
    }
  };

  if (status === "loading") {
    return null;
  }
  if (pathname === "/admin-cp/posts/new-post") {
    return null;
  }
  return (
    <nav className="absolute text-xl right-[10px] xs:right-[30px] top-[28px] flex gap-3 select-none">
      {session ? (
        <ul className="cursor-pointer" onClick={handleLogout}>
          Logout
        </ul>
      ) : (
        <ul className="hidden lg:block ">{session?.user?.username}</ul>
      )}
      <ul className="flex text-[15px]">
        <li>
          <Link href={redirectedPathName(i18n.locales[0])}>
            {i18n.locales[0]}
          </Link>
        </li>
        <span className="mx-1 text-[#666]">|</span>
        <li>
          <Link href={redirectedPathName(i18n.locales[1])}>
            {i18n.locales[1]}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
