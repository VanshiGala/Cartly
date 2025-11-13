import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/navbar";


export const metadata: Metadata = {
  title: "Cartly",
  description: "First E-Commerce website in next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-full flex-col bg-white">
        <Navbar />
        <main className="flex flex-col min-h-screen w-full bg-neutral-100">
        {children}
        </main>
      </body>
    </html>
  );
}
