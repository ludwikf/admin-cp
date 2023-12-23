import connectMongoDB from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDB();
    const users = await User.find().select("-password");
    return new NextResponse(JSON.stringify(users));
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
    });
  }
};
