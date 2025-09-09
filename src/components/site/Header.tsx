
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { AuthButtons } from "./AuthButtons";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-semibold hover:opacity-90 transition">
            News Blog
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:underline">
            Лента
          </Link>
          {/* Ссылку на админку можно показать только авторизованным */}
          {session && (
            <Link href="/admin" className="text-sm text-gray-600 hover:underline">
              Админка
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* <ThemeToggle /> */}
          <AuthButtons session={session} />
        </div>
      </div>
    </header>
  );
}
