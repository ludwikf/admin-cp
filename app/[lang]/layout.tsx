import { Roboto } from "next/font/google";
import "./globals.css";
import PlausibleProvider from "next-plausible";

import { getServerSession } from "next-auth/next";
import SessionProvider from "@/libs/SessionProvider";
import { getWebSettings } from "../components/WebSettings";
import React from "react";
import { Locale, i18n } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";

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
        <PlausibleProvider domain="ludwikfaron.com" />
        <title>{webProps.websiteTitle || "Ludwik's Cp"}</title>
        <meta name="description" content={webProps.websiteDescription} />
      </head>
      <body className={SS3.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
