import { YelpRecentLoginEmail } from "@/app/components/EmailTemplate";
import { Resend } from "resend";
import Newsletter from "@/models/Newsletter";
import connectMongoDB from "@/libs/mongodb";

const resend = new Resend(process.env.RESEND);

export async function POST(req: any) {
  const { subject, content } = await req.json();

  try {
    await connectMongoDB();
    const newsletter = await Newsletter.find();

    const emailPromise = newsletter.map(async (e: any) => {
      const data = await resend.emails.send({
        from: "test-admincp <newsletter@ludwikfaron.com>",
        to: [e.email],
        subject: subject,
        react: YelpRecentLoginEmail({ userFirstName: "john" }),
        // html: content,
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
