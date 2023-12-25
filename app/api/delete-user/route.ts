import connectMongoDB from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const DELETE = async (req: any) => {
  try {
    const userId = req.nextUrl.searchParams.get("id");
    await connectMongoDB();

    const deletedPost = await User.findByIdAndDelete(userId);
    if (!deletedPost) {
      return new NextResponse("User is already deleted", {
        status: 400,
      });
    }
    return new NextResponse("User has been deleted", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
