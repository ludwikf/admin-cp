import { Resend } from "resend";
import Newsletter from "@/models/Newsletter";
import connectMongoDB from "@/libs/mongodb";
import Settings from "@/models/Settings";

const resend = new Resend(process.env.RESEND);

export async function POST(req: any) {
  try {
    const { subject, content } = await req.json();
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

    return Response.json(results);
  } catch (error) {
    console.log(error);
    return Response.json({ error });
  }
}
