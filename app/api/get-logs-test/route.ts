import connectMongoDB from "@/libs/mongodb";
import Log from "@/models/Log";
import { NextResponse } from "next/server";

export const GET = async (req: any) => {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page")) || 1;
    const pageSize = 20;

    await connectMongoDB();

    const skip = (page - 1) * pageSize;

    const logs = await Log.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    return new NextResponse(JSON.stringify(logs));
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
    });
  }
};
