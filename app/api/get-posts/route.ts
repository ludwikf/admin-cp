import connectMongoDB from "@/libs/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const GET = async (req: any) => {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page")) || 1;
    const pageSize = 6;

    await connectMongoDB();

    const skip = (page - 1) * pageSize;

    const posts = await Post.find().skip(skip).limit(pageSize);

    return new NextResponse(JSON.stringify(posts));
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
    });
  }
};
