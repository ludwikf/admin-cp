import Newsletter from "@/models/Newsletter";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  const { email } = await req.json();

  await connectMongoDB();

  const newNewsletter = new Newsletter({
    email,
  });

  try {
    await newNewsletter.save();
    return new NextResponse("Newsletter created", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
