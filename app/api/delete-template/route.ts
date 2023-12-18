import connectMongoDB from "@/libs/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import { NextResponse } from "next/server";

export const DELETE = async (req: any) => {
  try {
    const templateId = req.nextUrl.searchParams.get("id");
    console.log(templateId);
    await connectMongoDB();

    const deletedTemplate = await EmailTemplate.findByIdAndDelete(templateId);
    if (!deletedTemplate) {
      return new NextResponse("Template is already deleted", {
        status: 400,
      });
    }
    return new NextResponse("Template has been deleted", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
