import Settings from "@/models/Settings";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

export const PUT = async (req: any) => {
  try {
    const { websiteTitle, websiteDescription } = await req.json();
    await connectMongoDB();
    const res = await Settings.updateMany({
      websiteTitle: websiteTitle,
      websiteDescription: websiteDescription,
    });
    if (!res) {
      return new NextResponse("Updating error", { status: 400 });
    }
    return new NextResponse("Settings updated", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
