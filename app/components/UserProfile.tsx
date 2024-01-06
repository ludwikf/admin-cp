"use client";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function UserProfile() {
  const { data: session, status }: any = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return null;
  }
  if (pathname === "/admin-cp/posts/new-post") {
    return null;
  }
  return (
    <nav className="hidden lg:block absolute text-xl right-[30px] top-[25px]">
      <ul>{session.user.username}</ul>
    </nav>
  );
}
