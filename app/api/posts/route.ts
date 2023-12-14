import connectMongoDB from "@/libs/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDB();
    const posts = await Post.find();
    return new NextResponse(JSON.stringify(posts));
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
    });
  }
};
