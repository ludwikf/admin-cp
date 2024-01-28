import FormatDate from "@/app/components/FormatDate";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import React from "react";

async function fetchUser() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEB_URL}/api/get-user-new`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function User({ dict }: any) {
  const user = await fetchUser();
  return (
    <div className="w-[80%] h-[70%] flex flex-col items-center">
      <div className="flex flex-col items-center xs:block">
        <div className="text-xl short:text-xl lg:text-2xl mb-3 xs:mb-6">
          {dict.user.title}
        </div>
        <div className="flex items-center mb-6 gap-2">
          <div>
            <UserCircleIcon className="w-16 mt-1" />
          </div>
          <div>
            <div className="text-xl xs:text-2xl text-mainTheme mb-1">
              {user[0]?.username}
            </div>
            <div className="text-sm xs:text-md">{user[0]?.email}</div>
          </div>
        </div>
        <div>{user[0]?.createdAt && FormatDate(user[0].createdAt, dict)}</div>
      </div>
    </div>
  );
}
