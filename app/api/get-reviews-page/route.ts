import connectMongoDB from "@/libs/mongodb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export const GET = async (req: any) => {
  try {
    const postId = req.nextUrl.searchParams.get("id");
    const page = parseInt(req.nextUrl.searchParams.get("page")) || 1;
    const pageSize = 7;
    await connectMongoDB();

    const skip = (page - 1) * pageSize;

    const reviews = await Review.find({ post: postId })
      .skip(skip)
      .limit(pageSize)
      .populate("user", "username");

    return new NextResponse(JSON.stringify(reviews));
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
    });
  }
};
