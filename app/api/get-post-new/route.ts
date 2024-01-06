import connectMongoDB from "@/libs/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDB();
    const data = await Post.find().sort({ createdAt: -1 }).limit(1);

    return new NextResponse(JSON.stringify(data));
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
