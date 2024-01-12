import { Roboto } from "next/font/google";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Navbar from "../../components/Navbar";
import UserProfile from "../../components/UserProfile";
import { authOptions } from "@/libs/authOptions";
import { getDictionary } from "@/libs/dictionary";
import { Locale } from "@/i18n.config";

const SS3 = Roboto({ subsets: ["latin"], weight: "400" });

export default async function RootLayout({
  params: { lang },
  children,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);
  const dictionary = await getDictionary(lang);

  if (!session) {
    redirect("/");
  }

  if ((session.user as { role?: string })?.role !== "admin") {
    redirect("/playground");
  }

  return (
    <main className={SS3.className}>
      <UserProfile />
      <Navbar
        locale={dictionary}
        params={{
          lang: lang,
        }}
      />
      {children}
    </main>
  );
}
