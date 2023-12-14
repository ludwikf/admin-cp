import connectMongoDB from "@/libs/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  const { title, content, author, image } = await req.json();

  await connectMongoDB();

  const newPost = new Post({
    title,
    content,
    author,
    image,
  });

  try {
    await newPost.save();
    return new NextResponse("Post created", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
