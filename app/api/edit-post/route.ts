import connectMongoDB from "@/libs/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const PUT = async (req: any) => {
  const id = req.nextUrl.searchParams.get("id");
  const { title, content, image } = await req.json();
  await connectMongoDB();
  const post = await Post.findByIdAndUpdate(id, {
    title: title,
    content: content,
    image: image,
  });
  if (!post) {
    return new NextResponse("Post is already deleted", { status: 400 });
  }
  try {
    return new NextResponse("Post updated", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
