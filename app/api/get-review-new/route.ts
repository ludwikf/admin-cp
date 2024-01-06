import connectMongoDB from "@/libs/mongodb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDB();
    const data = await Review.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .populate("user", "username");

    return new NextResponse(JSON.stringify(data));
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
