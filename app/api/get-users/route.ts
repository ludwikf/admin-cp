import connectMongoDB from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async (req: any) => {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page")) || 1;
    const pageSize = 15;

    await connectMongoDB();

    const skip = (page - 1) * pageSize;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(pageSize);

    return new NextResponse(JSON.stringify(users));
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
    });
  }
};
