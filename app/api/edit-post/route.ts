import connectMongoDB from "@/libs/mongodb";
import Log from "@/models/Log";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const PUT = async (req: any) => {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const { title, content, image, session } = await req.json();
    await connectMongoDB();
    const savedPost = await Post.findByIdAndUpdate(id, {
      title: title,
      content: content,
      image: image,
    });
    if (!savedPost) {
      return new NextResponse("Updating error", { status: 400 });
    }

    const newLog = new Log({
      user: {
        id: session.user._id,
        email: session.user.email,
        username: session.user.username,
      },
      actionType: "ContentAction",
      details: "Post modified",
    });

    await newLog.save();

    return new NextResponse("Post updated", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
