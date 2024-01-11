"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewTemplate() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { id } = useParams();

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

    setIsSubmitting(true);

    const title = e.target[0].value;
    const subject = e.target[1].value;
    const content = e.target[2].value;
    try {
      const res = await fetch(`/api/edit-template?id=${id}`, {
        method: "PUT",
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchTemplateDetails = async () => {
    if (!id) {
      return router.push("/admin-cp/newsletter");
    }
    try {
      const response = await fetch(`/api/single-template?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.title);
        setSubject(data.subject);
        setContent(data.content);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchTemplateDetails();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = content;
      adjustTextareaHeight();
    }
  }, [content]);

  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen flex-col justify-center items-center">
        <div className="w-[90%] min-h-[100%] flex mb-5">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full mt-5 lg:mt-0"
          >
            <input
              defaultValue={title}
              className="bg-inherit text-xl lg:text-3xl mt-10 placeholder:text-[#999] focus:outline-none"
              type="text"
              placeholder="Title"
              required
            />
            <input
              defaultValue={subject}
              className="bg-inherit text-lg lg:text-2xl placeholder:text-[#999] focus:outline-none"
              type="text"
              placeholder="Subject"
              required
            />
            <textarea
              defaultValue={content}
              ref={textareaRef}
              className="bg-inherit lg:text-xl placeholder:text-[#999] focus:outline-none resize-none"
              placeholder="Content"
              onInput={adjustTextareaHeight}
              required
            />
            <div>
              <button
                className="bg-white text-black rounded-xl px-3 py-2 hover:brightness-50 transition-all select-none"
                disabled={isSubmitting}
                type="submit"
              >
                Edit template
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
