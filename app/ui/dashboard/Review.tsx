import FormatDate from "@/app/components/FormatDate";
import { StarIcon } from "@heroicons/react/20/solid";
import React from "react";

export default async function Review({ dict }: any) {
  async function fetchReview() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/get-review-new`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      return res.json();
    } catch (error) {
      return null;
    }
  }
  const review = await fetchReview();
  return (
    <div className="w-[80%] h-[80%] flex flex-col items-center">
      <div className="flex flex-col items-center xs:block">
        <div className="text-xl short:text-xl lg:text-2xl mb-2 xs:mb-5">
          {dict.review.title}
        </div>

        <div className="flex flex-col items-center justify-center mb-5 gap-2 min-h-[100px]">
          <div className="text-lg xs:text-2xl text-mainTheme mb-1">
            {review[0]?.comment}
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="mt-0.5 mr-2">{review[0]?.user.username}</div>
            <div className="flex">
              {[...Array(5)].map((star, index) => {
                const currentRating = index + 1;
                return (
                  <StarIcon
                    key={index}
                    className={`w-[20px] xs:w-[25px]`}
                    color={
                      currentRating <= review[0]?.rating ? "#ffc107" : "#393939"
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div>
          {review[0]?.createdAt && FormatDate(review[0].createdAt, dict)}
        </div>
      </div>
    </div>
  );
}
