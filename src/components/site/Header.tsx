import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { AuthButtons } from "./AuthButtons";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-4 z-50 flex justify-center px-4">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-2xl border bg-white/80 px-6 py-3 shadow-md backdrop-blur-sm dark:bg-neutral-900/80">
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="font-semibold text-lg hover:text-primary transition-colors"
          >
            News Blog
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            News
          </Link>
          {session && (
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
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
