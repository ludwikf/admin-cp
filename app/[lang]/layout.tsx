import { Roboto } from "next/font/google";
import "./globals.css";

import { getServerSession } from "next-auth/next";
import SessionProvider from "@/libs/SessionProvider";
import { getWebSettings } from "../components/WebSettings";
import React from "react";
import { Locale, i18n } from "@/i18n.config";
import UserProfile from "../components/UserProfile";

const SS3 = Roboto({ subsets: ["latin"], weight: "400" });

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const webProps = await getWebSettings();
  const session = await getServerSession();
  return (
    <html lang={params.lang}>
      <head>
        <title>{webProps.websiteTitle || "Ludwik's Cp"}</title>
        <meta
          name="Ludwik's control panel"
          content={webProps.websiteDescription}
        />
        <script
          defer
          data-domain="ludwikfaron.com"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body className={SS3.className}>
        <SessionProvider session={session}>
          <UserProfile />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
