import connectMongoDB from "@/libs/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import Log from "@/models/Log";
import { NextResponse } from "next/server";

export const PUT = async (req: any) => {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const { title, subject, content, session } = await req.json();
    await connectMongoDB();
    const template = await EmailTemplate.findByIdAndUpdate(id, {
      title: title,
      subject: subject,
      content: content,
    });
    if (!template) {
      return new NextResponse("Template is already deleted", { status: 400 });
    }

    const newLog = new Log({
      user: {
        id: session.user._id,
        email: session.user.email,
        username: session.user.username,
      },
      actionType: "ContentAction",
      details: "Template modified",
    });

    await newLog.save();

    return new NextResponse("Template updated", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
