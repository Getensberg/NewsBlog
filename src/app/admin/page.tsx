
import Link from "next/link";
import { getAllNewsForAdmin } from "@/lib/queries";
import AdminListClient from "./AdminListClient";

export default async function AdminPage() {
  const all = await getAllNewsForAdmin();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Админка — Все новости</h1>
        <Link
          href="/admin/create"
          className="rounded bg-black px-3 py-2 text-sm text-white"
        >
          Создать черновик
        </Link>
      </div>

      {/* Весь список прокидываем в клиент для простой фильтрации */}
      <AdminListClient items={all} />
    </div>
  );
}



