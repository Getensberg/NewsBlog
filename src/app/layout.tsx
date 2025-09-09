// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/site/Header";

export const metadata: Metadata = {
  title: "News Blog",
  description: "Новости и админка",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
