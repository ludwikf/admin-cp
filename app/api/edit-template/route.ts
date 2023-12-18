import connectMongoDB from "@/libs/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import { NextResponse } from "next/server";

export const PUT = async (req: any) => {
  const id = req.nextUrl.searchParams.get("id");
  const { title, subject, content } = await req.json();
  console.log(title);
  await connectMongoDB();
  const template = await EmailTemplate.findByIdAndUpdate(id, {
    title: title,
    subject: subject,
    content: content,
  });
  if (!template) {
    console.log("errr");
  }
  try {
    return new NextResponse("Template updated", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
