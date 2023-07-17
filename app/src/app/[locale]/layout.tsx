import "@/app/globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";

import Footer from "@/components/footer/Footer";
import AppProvider from "@/contexts/AppProvider";
import MobileNavbar from "@/components/navbar/MobileNavbar";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AppProvider>
          <body className={inter.className}>
            <MobileNavbar />
            <Navbar />
            <main className="bg-body min-h-screen">{children}</main>
            <Footer />
          </body>
        </AppProvider>
      </NextIntlClientProvider>
    </html>
  );
}
