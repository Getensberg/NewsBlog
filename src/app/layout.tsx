import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/site/Header";

export const metadata: Metadata = {
  title: "News Blog",
  description: "News and Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="relative min-h-screen bg-gray-100 text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
        {/* ===== ФОНОВЫЕ СЛОИ (фиксированные, под контентом) ===== */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          {/* 1) Базовый мягкий вертикальный градиент (серый -> чуть светлее) */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-neutral-900 dark:to-neutral-950" />

          {/* 2) Лёгкая виньетка: затемнение по краям, центр прозрачный */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.10)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.08)_100%)]" />

          {/* 3) Едва заметное центральное “свечение”, чтобы подсветить контентную зону */}
          <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_20%,rgba(255,255,255,0.55),transparent)] dark:bg-[radial-gradient(600px_300px_at_50%_20%,rgba(255,255,255,0.06),transparent)]" />

          {/* 4) Мягкие градиентные тени сверху/снизу — создают глубину страницы */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/10 to-transparent dark:from-white/10" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/10 to-transparent dark:from-white/10" />

          {/* 5) Очень лёгкая боковая виньетка для фокуса на центре */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/5 to-transparent dark:from-white/5" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/5 to-transparent dark:from-white/5" />
        </div>

        {/* ===== КОНТЕНТ ПОВЕРХ ФОНА ===== */}
        <div className="relative z-10">
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10 md:py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
