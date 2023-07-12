import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AppProvider from "@/contexts/AppProvider";
import MobileNavbar from "@/components/navbar/MobileNavbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AppProvider>
        <body className={inter.className}>
          <MobileNavbar />
          <Navbar />
          <main className="bg-body min-h-screen">{children}</main>
          <Footer />
        </body>
      </AppProvider>
    </html>
  );
}
