"use client";
import React, { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ButtonSpinner } from "../components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

export default function Admincp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const { status: sessionStatus, data: session }: any = useSession();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    setLoading(true);
    try {
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
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      if (session && session.user.role === "admin") {
        return router.replace("/admin-cp");
      }
      router.replace("/playground");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "authenticated" || sessionStatus === "loading") {
    return null;
  }

  return (
    <main className="h-[100dvh] w-[100dvw] flex justify-center items-center">
      <div className="h-[100%] w-[100%] bg-secondTheme sm:w-[400px] sm:h-[400px] sm:rounded-2xl flex flex-col items-center justify-between">
        <FontAwesomeIcon
          className="w-[100px] h-[100px] text-mainTheme my-5"
          icon={faCode}
        />
        <form
          onSubmit={handleSubmit}
          className="w-[90%] h-[60%] flex flex-col items-center"
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
            className="w-full border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-6 focus:outline-none"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-[40%] tracking-wider font-bold text-md bg-mainTheme flex justify-center text-white py-2 rounded-full hover:bg-[#ea851998]"
          >
            {loading ? (
              <div className="w-6 h-6">
                <ButtonSpinner />
              </div>
            ) : (
              <p className="text-black">Login</p>
            )}
          </button>
          <p className="text-red-600 mt-4 ">{error && error}</p>
        </form>
        <div className="flex justify-center items-center my-2">
          <Link href={"/add-admin"} className="text-mainTheme">
            Create admin account
          </Link>
          <span className="mx-5 text-[#666]">||</span>
          <Link href={"/playground"} className="text-mainTheme flex gap-0.5">
            Playground
          </Link>
        </div>
      </div>
    </main>
  );
}
