
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  publishNews,
  unpublishNews,
  togglePin,
  deleteNews,
} from "@/actions/news";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Item = {
  id: number;
  title: string;
  slug: string;
  content: string;
  draft: boolean;
  isPinned: boolean;
  pinnedAt: Date | string | null;
  publishDate: Date | string | null;
  category: { id: number; name: string } | null;
};

type Props = { items: Item[] };

export default function AdminListClient({ items }: Props) {
  const [tab, setTab] = useState<"all" | "published" | "drafts">("all");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => {
    const names = Array.from(
      new Set(items.map((i) => i.category?.name).filter(Boolean) as string[])
    ).sort();
    return ["all", ...names];
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;

    if (tab === "published") list = list.filter((i) => !i.draft);
    if (tab === "drafts") list = list.filter((i) => i.draft);

    if (cat !== "all") list = list.filter((i) => i.category?.name === cat);

    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(s) ||
          i.slug.toLowerCase().includes(s) ||
          i.category?.name.toLowerCase().includes(s)
      );
    }
    return list;
  }, [items, tab, q, cat]);

  return (
    <div className="space-y-4">
      {/* Фильтры */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("all")}
            className={`rounded border px-3 py-1.5 text-sm ${
              tab === "all" ? "bg-black text-white" : "bg-white hover:bg-gray-50"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setTab("published")}
            className={`rounded border px-3 py-1.5 text-sm ${
              tab === "published"
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Published ({items.filter((i) => !i.draft).length})
          </button>
          <button
            onClick={() => setTab("drafts")}
            className={`rounded border px-3 py-1.5 text-sm ${
              tab === "drafts"
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Drafts ({items.filter((i) => i.draft).length})
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск..."
            className="h-10 w-full rounded border px-3 outline-none focus:border-black sm:w-72"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="h-10 rounded border bg-white px-3 outline-none focus:border-black"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
              <Th className="w-[40%]">Header</Th>
              <Th className="w-[16%]">Caregory</Th>
              <Th className="w-[16%]">Status</Th>
              <Th className="w-[16%]">Post</Th>
              <Th className="w-[10%] text-right pr-0">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr
                key={p.id}
                className={`${idx % 2 ? "bg-white" : "bg-gray-50/50"} align-top`}
              >
                {/* Заголовок + slug + PIN */}
                <Td>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {p.isPinned && (
                        <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                          PIN
                        </span>
                      )}
                      <span className="block truncate font-medium text-gray-900">
                        {p.title}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      /{p.slug}
                    </div>
                  </div>
                </Td>

                {/* Категория */}
                <Td>{p.category?.name ?? "—"}</Td>

                {/* Статус */}
                <Td>
                  {p.draft ? (
                    <Badge>Draft</Badge>
                  ) : (
                    <Badge tone="green">Published</Badge>
                  )}
                </Td>

                {/* Дата публикации */}
                <Td>
                  {p.publishDate ? (
                    <span className="text-xs text-gray-700">
                      {new Date(p.publishDate).toLocaleString("ru-RU")}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </Td>

                {/* Действия */}
                <Td className="pr-0">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 cursor-pointer">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/edit/${p.id}`}
                            className="cursor-pointer"
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <form action={togglePin} className="w-full">
                            <input type="hidden" name="id" value={p.id} />
                            <button
                              type="submit"
                              className="w-full text-left cursor-pointer"
                            >
                              {p.isPinned ? "Pin" : "Unpin"}
                            </button>
                          </form>
                        </DropdownMenuItem>

                        {p.draft ? (
                          <DropdownMenuItem asChild>
                            <form action={publishNews} className="w-full">
                              <input type="hidden" name="id" value={p.id} />
                              <button
                                type="submit"
                                className="w-full text-left cursor-pointer"
                              >
                                Publish
                              </button>
                            </form>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem asChild>
                            <form action={unpublishNews} className="w-full">
                              <input type="hidden" name="id" value={p.id} />
                              <button
                                type="submit"
                                className="w-full text-left cursor-pointer"
                              >
                                To draft
                              </button>
                            </form>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem asChild>
                          <form
                            action={deleteNews}
                            className="w-full"
                            onSubmit={(e) => {
                              if (!confirm("Are u sure?"))
                                e.preventDefault();
                            }}
                          >
                            <input type="hidden" name="id" value={p.id} />
                            <button
                              type="submit"
                              className="w-full text-left cursor-pointer text-red-600"
                            >
                              Delete
                            </button>
                          </form>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">
          nothing found
        </div>
      )}
    </div>
  );
}

/* helpers */

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={`py-2.5 pl-3 pr-4 ${className}`}>{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`py-3 pl-3 pr-4 align-top ${className}`}>{children}</td>;
}

function Badge({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "green";
}) {
  const map: Record<typeof tone, string> = {
    gray: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-800",
  };
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs ${map[tone]}`}>
      {children}
    </span>
  );
}
