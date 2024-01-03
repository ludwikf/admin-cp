import connectMongoDB from "@/libs/mongodb";
import Log from "@/models/Log";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export const DELETE = async (req: any) => {
  try {
    const reviewId = req.nextUrl.searchParams.get("id");
    const sessionData = await req.headers.get("Session");
    const session = JSON.parse(sessionData);
    await connectMongoDB();

    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return new NextResponse("Review is already deleted", { status: 400 });
    }

    const newLog = new Log({
      user: {
        id: session.user._id,
        email: session.user.email,
        username: session.user.username,
      },
      actionType: "Other",
      details: "Review deleted",
    });

    await newLog.save();

    return new NextResponse("Review deleted", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
