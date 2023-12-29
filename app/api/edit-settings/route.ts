import Settings from "@/models/Settings";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Log from "@/models/Log";

export const PUT = async (req: any) => {
  try {
    const { websiteTitle, websiteDescription, domain, session } =
      await req.json();
    await connectMongoDB();

    const existingSettings = await Settings.find();

    const changes: string[] = [];
    if (existingSettings) {
      if (existingSettings[0].websiteTitle !== websiteTitle) {
        changes.push("Title modified");
      }
      if (existingSettings[0].websiteDescription !== websiteDescription) {
        changes.push("Description modified");
      }
      if (existingSettings[0].domain !== domain) {
        changes.push("Domain modified");
      }
    }

    const res = await Settings.updateMany({
      websiteTitle: websiteTitle,
      websiteDescription: websiteDescription,
      domain: domain,
    });
    if (!res) {
      return new NextResponse("Updating error", { status: 400 });
    }

    if (changes.length > 0) {
      const newLog = new Log({
        user: {
          id: session.user._id,
          email: session.user.email,
          username: session.user.username,
        },
        actionType: "Other",
        details: changes.join(", "),
      });

      await newLog.save();
    }

    return new NextResponse("Settings updated", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
