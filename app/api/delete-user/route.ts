import connectMongoDB from "@/libs/mongodb";
import Log from "@/models/Log";
import User from "@/models/User";
import Post from "@/models/Post";
import Newsletter from "@/models/Newsletter";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export const DELETE = async (req: any) => {
  try {
    const userId = req.nextUrl.searchParams.get("id");
    const sessionData = await req.headers.get("Session");
    const session = JSON.parse(sessionData);
    await connectMongoDB();

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return new NextResponse("User is already deleted", {
        status: 400,
      });
    }
    await Post.deleteMany({ author: deletedUser.username });

    await Review.deleteMany({ user: deletedUser._id });

    await Newsletter.deleteMany({ email: deletedUser.email });

    const newLog = new Log({
      user: {
        id: session.user._id,
        email: session.user.email,
        username: session.user.username,
      },
      actionType: "UserActivity",
      details: "User deleted",
    });

    await newLog.save();

    return new NextResponse("User has been deleted", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
