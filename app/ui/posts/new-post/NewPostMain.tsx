"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewPostMain({ locale }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [media, setMedia] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const content = e.target[1].value;
    const author = session.user.username;
    let image = media;

    if (!media) {
      image =
        "https://firebasestorage.googleapis.com/v0/b/test-admincp.appspot.com/o/no-image-icon-2048x2048-2t5cx953.png?alt=media&token=91f72576-e73e-4274-90c2-c8f25b0f94de";
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/add-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, author, image, session }),
      });

      if (!res.ok) {
        throw new Error("Error submitting");
      }
      if (res.status === 200) {
        router.push("/admin-cp/posts");
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    const upload = async () => {
      if (file) {
        const storage = getStorage(app);
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setMedia(downloadURL);
            });
          }
        );
      }
    };
    upload();
  }, [file]);
  return (
    <>
      <div className="my-[25px] flex w-screen flex-col justify-center items-center">
        <div className="w-[90%] min-h-[100%] flex mb-5">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full mt-5 lg:mt-0"
          >
            <input
              className="bg-inherit text-3xl lg:text-5xl mt-10 placeholder:text-[#999] focus:outline-none"
              type="text"
              placeholder={locale.title}
              required
            />
            <textarea
              ref={textareaRef}
              className="bg-inherit text-lg lg:text-2xl placeholder:text-[#999] focus:outline-none resize-none"
              placeholder={locale.content}
              onInput={adjustTextareaHeight}
              required
            />
            <div>
              <input
                type="file"
                id="image"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex">
                <label className="w-[50px] relative" htmlFor="image">
                  <PlusCircleIcon className="w-10 cursor-pointer" />
                </label>
                <button
                  className="bg-white text-black rounded-xl px-3 py-2 hover:brightness-50 transition-all select-none"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {locale.create}
                </button>
              </div>
              <div className="select-none my-5 relative w-[200px] h-[110px]">
                {media && (
                  <Image
                    src={media}
                    alt="img"
                    fill
                    priority
                    className="rounded-xl object-cover object-left"
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
