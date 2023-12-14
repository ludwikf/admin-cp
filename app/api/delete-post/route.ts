import connectMongoDB from "@/libs/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const DELETE = async (req: any) => {
  const postId = req.nextUrl.searchParams.get("id");
  await connectMongoDB();

  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) {
    return new NextResponse(
      JSON.stringify({ error: "Post is already deleted" }),
      { status: 400 }
    );
  }
  try {
    return NextResponse.json({ message: "Posts deleted" }, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
