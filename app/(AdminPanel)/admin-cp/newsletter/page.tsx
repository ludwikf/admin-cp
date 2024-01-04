"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useSession } from "next-auth/react";

export default function Newsletter() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [useTemplate, setUseTemplate] = useState<any>("");
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data: session }: any = useSession();

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");

      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (error: any) {
      throw new Error("failed to fetch templates", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          session,
        }),
      });

      if (!res.ok) {
        throw new Error("Error sending newsletter");
      }
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleContentChange = () => {
    const content = textareaRef.current?.value || "";
    setPreview(content);
  };

  const deleteHandler = async (id: any) => {
    try {
      const res = await fetch(`/api/delete-template?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Session: JSON.stringify(session),
        },
      });

      if (res.ok) {
        fetchTemplates();
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", () => {
        const iframeDocument = iframe.contentDocument;
        if (iframeDocument) {
          const body = iframeDocument.body;
          if (body) {
            const newHeight = body.scrollHeight;
            setIframeHeight(newHeight);
          }
        }
      });
    }
  }, [preview]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (useTemplate && useTemplate.content) {
      setPreview(useTemplate.content);
      setSubject(useTemplate.subject || "");
      setContent(useTemplate.content || "");
    }
  }, [useTemplate]);

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
                    onChange={(e) => {
                      setSubject(e.target.value);
                    }}
                    value={subject}
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
                    value={content}
                    autoCorrect="off"
                    onChange={(e) => {
                      handleContentChange();
                      setContent(e.target.value);
                    }}
                    ref={textareaRef}
                    id="content"
                    className="rounded-xl w-full h-[300px] p-2 bg-inherit text-lg bg-secondTheme focus:outline-none resize-none"
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
              <div className="w-[90%]  flex flex-col justify-center items-center">
                <div className="flex justify-between mt-7">
                  <Link
                    href={"/admin-cp/newsletter/new-template"}
                    className="bg-white text-black px-3 py-2 rounded-xl hover:brightness-50 transition-all mb-3"
                  >
                    Create Template
                  </Link>
                </div>
                <ul className="w-ful flex flex-col items-center">
                  {isLoading ? (
                    <div className="mt-2 w-12 h-12">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    templates.map((t) => (
                      <div key={t._id} className="flex gap-1.5">
                        <li
                          onClick={() => setUseTemplate(t)}
                          className="w-[100%] break-all text-center my-2 text-lg hover:text-mainTheme cursor-pointer select-none"
                        >
                          {t.title}
                        </li>
                        <Link
                          rel="stylesheet"
                          href={`/admin-cp/newsletter/edit-template/${t._id}`}
                          className="cursor-pointer flex hover:text-mainTheme"
                        >
                          <PencilSquareIcon className="w-5" />
                        </Link>

                        <TrashIcon
                          onClick={() => deleteHandler(t._id)}
                          className="w-11 cursor-pointer hover:text-mainTheme"
                        />
                      </div>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl text-mainTheme font-bold mb-5">Preview</h1>{" "}
            <div className="w-[100%] border-t-2 border-[#222] mb-10 ">
              {preview && (
                <div className="flex items-center justify-start bg-white">
                  <iframe
                    title="Preview"
                    ref={iframeRef}
                    className="w-full border-none "
                    style={{
                      height: iframeHeight ? `${iframeHeight}px` : "100%",
                    }}
                    srcDoc={`<!DOCTYPE html><html><head><style>body { margin: 0; word-wrap: break-word; }</style></head><body>${preview}</body></html>`}
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
