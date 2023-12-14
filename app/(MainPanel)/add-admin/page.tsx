"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Icon from "@/public/fav.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/admin-cp");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const username = e.target[1].value;
    const password = e.target[2].value;
    const newsletter = e.target[3].checked;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 3) {
      setError("Password is too short");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      if (!res.ok) {
        res.json().then((e) => {
          setError(e.error);
        });
      }
      if (res.status === 200) {
        if (newsletter) {
          const newsletterRes = await fetch("/api/add-newsletter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
          if (!newsletterRes.ok) {
            throw new Error("Failed to create newsletter");
          }
        }
        setError("");
        router.push("/");
      }
    } catch (error) {
      setError("Error, try again");
    }
  };

  if (sessionStatus === "authenticated" || sessionStatus === "loading") {
    return null;
  }

  return (
    <main className="tCenter">
      <div className="bg-secondTheme w-[400px] h-[450px] rounded-2xl flex flex-col items-center ">
        <Image src={Icon} alt="icon" className="w-[100px] my-5" />
        <form
          onSubmit={handleSubmit}
          className="w-[90%] flex flex-col items-center"
        >
          <input
            type="text"
            className="w-full border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
            placeholder="Email"
            required
          />
          <input
            type="text"
            className="w-full border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
            placeholder="Username"
            required
          />
          <input
            type="password"
            className="w-full border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
            placeholder="Password"
            required
          />
          <div className="flex w-full items-center ml-4 mb-6">
            <input
              id="default-checkbox"
              type="checkbox"
              className="w-5 h-5 accent-mainTheme"
            />

            <label
              htmlFor="default-checkbox"
              className="ms-2 text-ms text-[#ccc] select-none"
            >
              Newsletter
            </label>
          </div>
          <button
            type="submit"
            className="w-3/4 tracking-wider font-bold text-md bg-mainTheme text- text-white py-2 rounded-full hover:bg-[#ea851998]"
          >
            {" "}
            Register
          </button>
          <p className="text-red-600 mt-4 ">{error && error}</p>
        </form>
      </div>
    </main>
  );
}
