import { Roboto } from "next/font/google";
import "./globals.css";
import PlausibleProvider from "next-plausible";

import { getServerSession } from "next-auth/next";
import SessionProvider from "@/libs/SessionProvider";
import { getWebSettings } from "./components/WebSettings";
import React from "react";

const SS3 = Roboto({ subsets: ["latin"], weight: "400" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webProps = await getWebSettings();
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <PlausibleProvider
          domain="ludwikfaron.com"
          trackLocalhost={true}
          enabled={true}
        />
        <title>{webProps.websiteTitle || "Ludwik's Cp"}</title>
        <meta name="description" content={webProps.websiteDescription} />
      </head>
      <body className={SS3.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
