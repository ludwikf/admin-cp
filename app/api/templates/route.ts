import connectMongoDB from "@/libs/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDB();
    const templates = await EmailTemplate.find();
    return new NextResponse(JSON.stringify(templates));
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
