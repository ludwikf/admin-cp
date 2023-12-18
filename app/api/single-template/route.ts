import connectMongoDB from "@/libs/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import { NextResponse } from "next/server";

export const GET = async (req: any) => {
  const id = req.nextUrl.searchParams.get("id");
  await connectMongoDB();
  const template = await EmailTemplate.findById(id);
  try {
    return new NextResponse(JSON.stringify(template), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
