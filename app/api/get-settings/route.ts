import Settings from "@/models/Settings";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDB();
    const data = await Settings.find();
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
