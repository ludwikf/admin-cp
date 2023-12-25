import connectMongoDB from "@/libs/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const GET = async (req: any) => {
  const id = req.nextUrl.searchParams.get("id");
  await connectMongoDB();
  const post = await Post.findById(id);
  try {
    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
