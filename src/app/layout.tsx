import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/navbar";
import AuthProvider from "./context/AuthProvider";

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
        <AuthProvider>
          <Navbar />
        <main className="flex flex-col min-h-screen w-full bg-neutral-100">
        {children}
        </main>
      </AuthProvider>
      </body>
    </html>
  );
}
