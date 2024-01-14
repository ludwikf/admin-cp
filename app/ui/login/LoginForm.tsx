"use client";
import React, { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonSpinner } from "../../components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import CustomLink from "@/app/components/CustomLink";
import GetLocale from "@/app/components/GetLocale";

export default function LoginForm({ locale, lang }: any) {
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
        router.replace(`${GetLocale("/admin-cp", lang)}`);
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
        return router.replace(`${GetLocale("/admin-cp", lang)}`);
      }
      router.replace(`${GetLocale("/playground", lang)}`);
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "authenticated" || sessionStatus === "loading") {
    return null;
  }

  return (
    <>
      <div className="bg-secondTheme short:bg-inherit short:pt-3 w-[100%] short:w-[100%] short:h-[100%] short:rounded-none sm:w-[400px] tall:w-[800px] h-[100%] sm:h-[400px] tall:h-[800px] sm:rounded-2xl flex flex-col items-center justify-between">
        <FontAwesomeIcon
          className="w-[100px] h-[100px] tall:w-[200px] tall:h-[200px] text-mainTheme my-5 short:hidden"
          icon={faCode}
        />
        <form
          onSubmit={handleSubmit}
          className="w-[90%] h-[60%] flex flex-col items-center"
        >
          <input
            id="email"
            type="text"
            className="w-full tall:text-3xl tall:py-5 tall:px-6 border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
            placeholder={locale.email}
            required
          />
          <input
            id="password"
            type="password"
            className="w-full tall:text-3xl tall:py-5 tall:px-6 border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-6 tall:mb-12 focus:outline-none"
            placeholder={locale.password}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-[40%] tracking-wider font-bold text-md tall:text-3xl tall:py-4 tall:px-4 bg-mainTheme flex justify-center text-white py-2 rounded-full hover:bg-[#ea851998]"
          >
            {loading ? (
              <div className="w-6 h-6">
                <ButtonSpinner />
              </div>
            ) : (
              <p className="text-black">{locale.login}</p>
            )}
          </button>
          <p className="text-red-600 mt-4 ">{error && error}</p>
        </form>
        <div className="flex justify-center items-center mb-10 sm:my-2 tall:my-5 tall:text-3xl">
          <CustomLink
            href={`/add-admin`}
            lang={lang}
            className="text-mainTheme"
          >
            {locale.goToRegister}
          </CustomLink>
          <span className="mx-5 text-[#666]">||</span>
          <CustomLink
            href={`/playground`}
            lang={lang}
            className="text-mainTheme flex gap-0.5"
          >
            Playground
          </CustomLink>
        </div>
      </div>
    </>
  );
}
