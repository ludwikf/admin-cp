"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

export default function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webProps, setWebProps] = useState<any>("");
  const { data: session }: any = useSession();

  const handleSave = async () => {
    const websiteTitle =
      (document.getElementById("webTitle") as HTMLInputElement)?.value ||
      webProps.websiteTitle;
    const websiteDescription =
      (document.getElementById("webDescription") as HTMLInputElement)?.value ||
      webProps.websiteDescription;
    const domain =
      (document.getElementById("domain") as HTMLInputElement)?.value ||
      webProps.websiteDescription;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/edit-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteTitle,
          websiteDescription,
          domain,
          session,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update settings");
      }
      window.location.reload();
    } catch (error: any) {
      throw new Error(error.message || "Error updating settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchWebSettings = async () => {
      try {
        const res = await fetch("/api/get-settings");
        if (!res.ok) {
          throw new Error("Error fetching data");
        }
        const data = await res.json();
        setWebProps(data[0]);
      } catch (error: any) {
        throw new Error(error);
      }
    };
    fetchWebSettings();
  }, []);

  return (
    <main className="flex min-h-screen">
      <div className="my-[25px] flex w-screen lg:h-auto flex-col short:justify-start lg:justify-center items-center">
        <div className="w-[100%] short:w-[100%] lg:w-[90%] short:h-[auto] lg:h-[16%] flex justify-center short:justify-center lg:justify-start mb-[20px] short:mb-[20px] lg:mb-[0px]">
          <div className="flex flex-col items-center short:flex lg:block">
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
        </div>
        <div className="w-[100%] lg:w-[90%] h-full flex flex-col items-center">
          <div className="bg-secondTheme w-full lg:w-4/5 h-full lg:rounded-3xl flex justify-center">
            <div className="w-4/5">
              <div className="flex flex-col my-10">
                <label htmlFor="webTitle" className="text-lg">
                  Website Title
                </label>
                <input
                  id="webTitle"
                  placeholder="Change website title"
                  defaultValue={webProps.websiteTitle}
                  type="text"
                  className="bg-secondTheme shadow-[0_4px_0px_-2px_rgba(100,100,100,1)] text-[#777]  placeholder:text-[#777] rounded-3xl py-1 px-4 mt-2 transition focus:outline-none focus:text-[#fff] focus:shadow-white"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col my-10">
                <label htmlFor="webDescription" className="text-lg">
                  Website Description
                </label>
                <input
                  id="webDescription"
                  placeholder="Change website title"
                  defaultValue={webProps.websiteDescription}
                  type="text"
                  className="bg-secondTheme shadow-[0_4px_0px_-2px_rgba(100,100,100,1)] text-[#777]  placeholder:text-[#777] rounded-3xl py-1 px-4 mt-2 transition focus:outline-none focus:text-[#fff] focus:shadow-white"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col my-10">
                <label htmlFor="webDescription" className="text-lg">
                  Email Domain
                </label>
                <input
                  id="domain"
                  placeholder="Change domain"
                  defaultValue={webProps.domain}
                  type="text"
                  className="bg-secondTheme shadow-[0_4px_0px_-2px_rgba(100,100,100,1)] text-[#777]  placeholder:text-[#777] rounded-3xl py-1 px-4 mt-2 transition focus:outline-none focus:text-[#fff] focus:shadow-white"
                  spellCheck={false}
                />
              </div>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-mainTheme select-none mb-5 text-black py-2 px-5 rounded-xl hover:brightness-75 transition "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
