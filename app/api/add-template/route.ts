import connectMongoDB from "@/libs/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import Log from "@/models/Log";
import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  try {
    await connectMongoDB();
    const { title, subject, content, session } = await req.json();

    const newTemplate = new EmailTemplate({
      title,
      subject,
      content,
    });

    const savedTemplate = await newTemplate.save();

    if (!savedTemplate) {
      return new NextResponse("Error saving post", { status: 400 });
    }

    const newLog = new Log({
      user: {
        id: session.user._id,
        email: session.user.email,
        username: session.user.username,
      },
      actionType: "ContentAction",
      details: "Template created",
    });

    await newLog.save();

    return new NextResponse("Template created", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
