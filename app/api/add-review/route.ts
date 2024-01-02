import { NextResponse } from "next/server";
import Review from "@/models/Review";
import connectMongoDB from "@/libs/mongodb";

export const POST = async (req: any) => {
  try {
    const { post, user, rating, comment } = await req.json();
    await connectMongoDB();

    const existingReview = await Review.findOne({ post: post, user: user });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;

      await existingReview.save();

      return new NextResponse("Review created", { status: 200 });
    } else {
      const newReview = new Review({
        post: post,
        user: user,
        rating: rating,
        comment: comment,
      });

      await newReview.save();

      return new NextResponse(newReview, { status: 200 });
    }
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
