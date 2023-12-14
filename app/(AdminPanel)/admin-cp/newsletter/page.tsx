"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";

export default function Newsletter() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const subject = e.target[0].value;
    const content = e.target[1].value;

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          subject,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error("Error sending newsletter");
      }
      if (res.status === 200) {
        console.log("worked");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleContentChange = () => {
    const content = textareaRef.current?.value || "";
    setPreview(content);
  };

  return (
    <main className="flex min-h-screen">
      <div className="my-[25px] flex w-screen flex-col justify-center items-center">
        <div className="w-[90%] h-[16vh] flex">
          <div>
            <h1 className="text-3xl font-bold">Newsletter</h1>
            <p className="text-mainTheme">Send an e-mail to your subscribers</p>
          </div>
        </div>
        <div className="w-[90%] h-[84vh] flex flex-col items-center">
          <div className="w-full flex">
            <div className="w-[70%]">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start"
              >
                <div className="flex flex-col mb-5 w-full">
                  <label htmlFor="subject" className="text-lg">
                    Subject
                  </label>
                  <input
                    className="bg-inherit text-2xl bg-secondTheme focus:outline-none p-2 rounded-xl"
                    type="text"
                    id="subject"
                  />
                </div>
                <div className="w-full">
                  {" "}
                  <label htmlFor="content" className="text-lg">
                    Content
                  </label>
                  <textarea
                    autoCorrect="off"
                    onChange={handleContentChange}
                    ref={textareaRef}
                    id="content"
                    className="rounded-xl w-full h-[350px] p-2 bg-inherit text-lg bg-secondTheme focus:outline-none resize-none"
                  />
                </div>

                <button
                  className="bg-mainTheme py-2 mt-4 w-[100px] text-black rounded hover:brightness-75"
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
            <div className="w-[30%] flex flex-col items-end">
              <div className="flex justify-between">
                <Link
                  href={"/admin-cp/new-template"}
                  className="bg-white text-black px-3 py-2 rounded-xl hover:brightness-50 transition-all mb-3"
                >
                  Create Template
                </Link>
              </div>
              <ul>
                <li>asdsds</li>
                <li>asdsds</li>
                <li>asdsds</li>
              </ul>
            </div>
          </div>
          <div className="w-full flex flex-col items-center min-h-[110vh]">
            <h1 className="text-2xl text-mainTheme font-bold mb-5">Preview</h1>
            <div className="w-[60%] min-h-[95vh] border border-[#222]">
              {preview && (
                <div
                  className="flex items-center justify-center h-full bg-white"
                  style={{ transform: "scale(0.9)" }}
                >
                  <iframe
                    title="Preview"
                    className="w-full h-full"
                    style={{ border: "none" }}
                    srcDoc={`<!DOCTYPE html><html><head><style>body { margin: 0; }</style></head><body>${preview}</body></html>`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
