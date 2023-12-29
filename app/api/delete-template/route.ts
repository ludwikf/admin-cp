import connectMongoDB from "@/libs/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import Log from "@/models/Log";
import { NextResponse } from "next/server";

export const DELETE = async (req: any) => {
  try {
    const templateId = req.nextUrl.searchParams.get("id");
    const sessionData = await req.headers.get("Session");
    const session = JSON.parse(sessionData);
    await connectMongoDB();

    const deletedTemplate = await EmailTemplate.findByIdAndDelete(templateId);
    if (!deletedTemplate) {
      return new NextResponse("Template is already deleted", {
        status: 400,
      });
    }

    const newLog = new Log({
      user: {
        id: session.user._id,
        email: session.user.email,
        username: session.user.username,
      },
      actionType: "ContentAction",
      details: "Template deleted",
    });

    await newLog.save();

    return new NextResponse("Template has been deleted", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
