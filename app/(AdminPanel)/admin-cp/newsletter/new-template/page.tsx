"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewTemplate() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { data: session }: any = useSession();

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const title = e.target[0].value;
    const subject = e.target[1].value;
    const content = e.target[2].value;

    try {
      const res = await fetch("/api/add-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, subject, content, session }),
      });

      if (!res.ok) {
        res.json().then((e) => {
          console.log(e);
        });
      }
      if (res.status === 200) {
        router.push("/admin-cp/newsletter");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen flex-col justify-center items-center">
        <div className="w-[90%] min-h-[100%] flex mb-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <input
              className="bg-inherit text-3xl mt-10 placeholder:text-[#999] focus:outline-none"
              type="text"
              placeholder="Title"
              required
            />
            <input
              className="bg-inherit text-2xl placeholder:text-[#999] focus:outline-none"
              type="text"
              placeholder="Subject"
              required
            />
            <textarea
              ref={textareaRef}
              className="bg-inherit text-2xl placeholder:text-[#999] focus:outline-none resize-none"
              placeholder="Content"
              onInput={adjustTextareaHeight}
              required
            />
            <div>
              <button
                className="bg-white text-black rounded-xl px-3 py-2 hover:brightness-50 transition-all select-none"
                type="submit"
              >
                Create template
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
