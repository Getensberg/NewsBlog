
import { notFound } from "next/navigation";
import { getNewsForEdit, getCategories } from "@/lib/queries";
import EditNewsForm from "./EditNewsForm";

export default async function EditNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { id: idStr } = await params;
  const sp = await searchParams;
  const error = sp?.error;
  const ok = sp?.ok;

  const id = Number(idStr);
  if (!Number.isInteger(id)) notFound();

  const [post, categories] = await Promise.all([
    getNewsForEdit(id),
    getCategories(),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Edit</h1>

      {/* Ошибка из query (?error=...) */}
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* NEW: Сообщение об успехе (?ok=1, либо текст) */}
      {ok && (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {ok === "1" ? "Published" : ok}
        </div>
      )}

      <EditNewsForm
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          categoryId: post.categoryId, // number | null
          isPinned: post.isPinned,
          draft: post.draft,
          publishDate: post.publishDate,
          pinnedAt: post.pinnedAt,
          image: post.image ?? null,   // пробрасываем превью
        }}
        categories={categories}
      />
    </div>
  );
}
