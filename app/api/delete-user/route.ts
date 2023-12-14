import connectMongoDB from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const userId = req.nextUrl.searchParams.get("id");
    await connectMongoDB();

    const deletedPost = await User.findByIdAndDelete(userId);
    if (!deletedPost) {
      return new NextResponse(
        JSON.stringify({ error: "Post is already deleted" }),
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }), { status: 400 });
  }
};
