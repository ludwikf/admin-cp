import { NextResponse } from "next/server";
import Review from "@/models/Review";
import connectMongoDB from "@/libs/mongodb";
import Log from "@/models/Log";

export const POST = async (req: any) => {
  try {
    const { post, user, rating, comment, session } = await req.json();
    await connectMongoDB();

    const existingReview = await Review.findOne({ post: post, user: user });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;

      const savedReview = await existingReview.save();

      if (!savedReview) {
        return new NextResponse("Error saving review", { status: 400 });
      }

      const newLog = new Log({
        user: {
          id: session.user._id,
          email: session.user.email,
          username: session.user.username,
        },
        actionType: "Other",
        details: "Review modified",
      });

      await newLog.save();

      return new NextResponse("Review created", { status: 200 });
    } else {
      const newReview = new Review({
        post: post,
        user: user,
        rating: rating,
        comment: comment,
      });

      const savedReview = await newReview.save();

      if (!savedReview) {
        return new NextResponse("Error saving review", { status: 400 });
      }

      const newLog = new Log({
        user: {
          id: session.user._id,
          email: session.user.email,
          username: session.user.username,
        },
        actionType: "Other",
        details: "Review created",
      });

      await newLog.save();

      return new NextResponse(newReview, { status: 200 });
    }
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
