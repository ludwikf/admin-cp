"use client";
import React, { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Icon from "@/public/fav.png";
import Link from "next/link";

export default function Admincp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/playground");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 3) {
      setError("Password is too short");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      setError("");
      router.replace("/admin-cp");
    }
  };

  if (sessionStatus === "authenticated" || sessionStatus === "loading") {
    return null;
  }

  return (
    <main className="tCenter">
      <div className="bg-secondTheme w-[400px] h-[400px] rounded-2xl flex flex-col items-center ">
        <Image src={Icon} alt="icon" className="w-[100px] my-5" />
        <form
          onSubmit={handleSubmit}
          className="w-[90%] flex flex-col items-center"
        >
          <input
            id="email"
            type="text"
            className="w-full border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
            placeholder="Email"
            required
          />
          <input
            id="password"
            type="password"
            className="w-full border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-3/4 tracking-wider font-bold text-md bg-mainTheme text- text-white py-2 rounded-full hover:bg-[#ea851998]"
          >
            {" "}
            Login
          </button>
          <p className="text-red-600 mt-4 ">{error && error}</p>
        </form>
        <Link href={"/add-admin"} className="text-mainTheme mt-3">
          Create admin account
        </Link>
      </div>
      <div className="w-full flex justify-center mt-2">
        <Link href={"/playground"} className="text-mainTheme flex gap-0.5">
          Playground
          <ArrowRightIcon className="w-4" />
        </Link>
      </div>
    </main>
  );
}
