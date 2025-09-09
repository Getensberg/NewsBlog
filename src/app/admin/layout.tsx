
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { notFound } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const email = (session?.user?.email ?? "").toLowerCase();

  if (!session || (allow.length && !allow.includes(email))) {
    notFound();
  }
  return <>{children}</>;
}
