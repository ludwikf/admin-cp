import connectMongoDB from "@/libs/mongodb";
import Log from "@/models/Log";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDB();
    const logs = await Log.find();
    return new NextResponse(JSON.stringify(logs));
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
    });
  }
};
