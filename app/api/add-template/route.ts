import connectMongoDB from "@/libs/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import Settings from "@/models/Settings";
import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  await connectMongoDB();
  const { title, subject, content } = await req.json();

  const newTemplate = new EmailTemplate({
    title,
    subject,
    content,
  });

  try {
    await newTemplate.save();
    return new NextResponse("Template created", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
