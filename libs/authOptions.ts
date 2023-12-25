import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectMongoDB from "@/libs/mongodb";
import { Session } from "next-auth";

interface CustomUser {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  role?: string | null | undefined;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials are missing.");
        }

        try {
          await connectMongoDB();
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }: { session: Session & { user?: CustomUser } }) {
      if (session && session.user && session.user.email) {
        await connectMongoDB();
        const user = await User.findOne({
          email: session.user.email,
        });

        if (user) {
          const { password, ...userData } = user.toObject();
          session.user = userData;
        }
      }

      return session;
    },
  },
};
