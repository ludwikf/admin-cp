"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import CustomLink from "@/app/components/CustomLink";
import GetLocale from "@/app/components/GetLocale";

export default function RegisterForm({ locale, lang }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace(`${GetLocale("/admin-cp", lang)}`);
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

    setLoading(true);
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
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        router.push(`${GetLocale("/admin-cp", lang)}`);
      }
    } catch (error) {
      setError("Error, try again");
    } finally {
      setLoading(false);
    }
  };

  if (sessionStatus === "authenticated" || sessionStatus === "loading") {
    return null;
  }

  return (
    <>
      <div className="h-[100%] w-[100%] bg-secondTheme short:pt-3 short:bg-inherit short:w-[100%] short:h-[100%] short:rounded-none sm:w-[400px] tall:w-[800px] sm:h-[400px] tall:h-[800px] sm:rounded-2xl flex flex-col items-center justify-between">
        <FontAwesomeIcon
          className="w-[100px] h-[100px] text-mainTheme my-5 tall:w-[200px] tall:h-[200px] short:hidden"
          icon={faCode}
        />
        <form
          onSubmit={handleSubmit}
          className="w-[90%] flex flex-col items-center"
        >
          <input
            type="text"
            className="w-full border-0 tall:text-3xl tall:py-5 tall:px-6 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
            placeholder={locale.email}
            required
          />
          <input
            type="text"
            className="w-full border-0 tall:text-3xl tall:py-5 tall:px-6 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
            placeholder={locale.username}
            required
          />
          <input
            type="password"
            className="w-full border-0 tall:text-3xl tall:py-5 tall:px-6 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
            placeholder={locale.password}
            required
          />
          <div className="flex w-full items-center ml-4 mb-6 tall:text-3xl">
            <input
              id="default-checkbox"
              type="checkbox"
              className="w-5 h-5 tall:w-6 tall:h-6 accent-mainTheme"
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
            disabled={loading}
            className="w-[50%] tall:text-3xl tall:py-4 tall:px-4 tracking-wider font-bold text-md flex justify-center bg-mainTheme text- text-white py-2 rounded-full hover:bg-[#ea851998]"
          >
            {loading ? (
              <div className="w-6 h-6">
                <ButtonSpinner />
              </div>
            ) : (
              <p className="text-black">{locale.register}</p>
            )}
          </button>
          <p className="text-red-600 mt-4 ">{error && error}</p>
        </form>
        <div className="mb-10 sm:my-2 tall:my-5 tall:text-3xl">
          <CustomLink
            href={`/`}
            lang={lang}
            className="text-mainTheme flex gap-0.5"
          >
            <ArrowLeftIcon className="w-4 tall:w-8" />
            <p>{locale.back}</p>
          </CustomLink>
        </div>
      </div>
    </>
  );
}
