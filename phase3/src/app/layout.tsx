import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { RealtimeProvider } from "@/components/shell/RealtimeProvider";
import { SessionProvider } from "@/components/shell/SessionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AEGIS — AI Security Platform",
  description: "AI-Enhanced Guardian for Intelligent Security: Penetration Testing & Real-time Defense",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <SessionProvider>
          <RealtimeProvider>
            <Sidebar />
            <div className="pl-56 min-h-screen flex flex-col">
              <Topbar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </RealtimeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
