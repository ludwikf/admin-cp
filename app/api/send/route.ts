import { Resend } from "resend";
import Newsletter from "@/models/Newsletter";
import connectMongoDB from "@/libs/mongodb";
import Settings from "@/models/Settings";
import Log from "@/models/Log";

const resend = new Resend(process.env.RESEND);

export async function POST(req: any) {
  try {
    const { subject, content, session } = await req.json();
    await connectMongoDB();
    const webProps: any = await Settings.find();
    const newsletter = await Newsletter.find();

    const emailPromise = newsletter.map(async (e: any) => {
      const data = await resend.emails.send({
        from: `test-admincp <newsletter@${webProps[0].domain}>`,
        to: [e.email],
        subject: subject,
        html: content,
      });
      return data;
    });

    const results = await Promise.all(emailPromise);

    if (!results) {
      throw new Error("Error sending email");
    }

    const newLog = new Log({
      user: {
        id: session.user._id,
        email: session.user.email,
        username: session.user.username,
      },
      actionType: "Other",
      details: "Newsletter send",
    });

    await newLog.save();

    return Response.json(results);
  } catch (error) {
    return Response.json({ error });
  }
}
