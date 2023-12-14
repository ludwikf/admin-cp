import User from "@/models/User";
import connectMongoDB from "@/libs/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { email, username, password } = await request.json();

  await connectMongoDB();

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    if (existingUser.email === email) {
      return new NextResponse(
        JSON.stringify({ error: "Email is already in use" }),
        { status: 400 }
      );
    } else if (existingUser.username === username) {
      return new NextResponse(
        JSON.stringify({ error: "Nickname is already in use" }),
        { status: 400 }
      );
    }
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    email,
    username,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new NextResponse("user is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
