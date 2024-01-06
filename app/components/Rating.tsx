import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Rating({ postId, readOnly = false }: any) {
  const [ratingValue, setRatingValue] = useState<any>(null);
  const [hover, setHover] = useState<any>(null);
  const [reviews, SetReviews] = useState<any[]>([]);
  const [form, setForm] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<any>(null);
  const [commentValue, setCommentValue] = useState<string>("");

  const { data: session }: any = useSession();
  const router = useRouter();

  const handleSubmit = async (r: any) => {
    try {
      const post = postId;
      const user = session?.user._id;
      const rating = r;
      const comment = commentValue;

      const res = await fetch("/api/add-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post, user, rating, comment, session }),
      });

      if (!res.ok) {
        throw new Error("Error with adding new review");
      }

      setRatingValue(ratingValue);

      await fetchReviews();
      setForm(false);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/get-reviews?postId=${postId}`);

      if (!res.ok) {
        throw new Error("Error with fetching reviews");
      }

      const data = await res.json();
      SetReviews(data);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const handleStarClick = (currentRating: any) => {
    if (!session?.user) {
      return router.replace("/");
    }
    setForm(true);
    setSelectedRating(currentRating);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;
      setRatingValue(averageRating);
    }
  }, [reviews]);

  return (
    <>
      <div className="flex">
        {[...Array(5)].map((star, index) => {
          const currentRating = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={currentRating}
                onClick={() => handleStarClick(currentRating)}
                className="hidden"
                disabled={readOnly}
              />
              <StarIcon
                className={`w-[100%] ${
                  readOnly ? "cursor-default" : "cursor-pointer"
                }`}
                color={
                  currentRating <= (hover || ratingValue)
                    ? "#ffc107"
                    : "#393939"
                }
                onMouseEnter={
                  readOnly ? undefined : () => setHover(currentRating)
                }
                onMouseLeave={readOnly ? undefined : () => setHover(null)}
              />
            </label>
          );
        })}
      </div>
      {form && (
        <div className="z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
          <div className="absolute tCenter w-[40vw] h-[50vh] bg-secondTheme bg-opacity-90 rounded-3xl border-2 border-mainTheme">
            <div className="flex flex-col justify-between items-center h-[100%]">
              <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl my-5">Comment </h1>
                  <span className="text-lg text-[#666]">(Optional)</span>{" "}
                  {[...Array(5)].map((star, index) => {
                    const currentRating = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={selectedRating}
                          onClick={() => {
                            setSelectedRating(currentRating);
                          }}
                          className="hidden"
                        />
                        <StarIcon
                          className="w-8 cursor-pointer star"
                          color={
                            currentRating <=
                            (selectedRating || hover || ratingValue)
                              ? "#ffc107"
                              : "#393939"
                          }
                        />
                      </label>
                    );
                  })}
                </div>
                <textarea
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  placeholder="Enter your comment"
                  className="w-[90%] h-[90%] resize-none border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-lg px-3 py-2 mb-5 focus:outline-none"
                />
              </div>
              <div className="flex justify-center my-10">
                <button
                  onClick={() => {
                    setForm(false);
                    setSelectedRating(null);
                  }}
                  className="bg-white px-4 py-2 mr-5 rounded text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit(selectedRating)}
                  className="bg-mainTheme text-black px-6 py-2 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
