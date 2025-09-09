"use client";

import { useId, useMemo, useState } from "react";
import type { NewsDTO } from "@/types/news";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { PostCard } from "@/components/ui/PostCard";

export default function HomeClient({
  initialNews,
  options,
}: {
  initialNews: NewsDTO[];
  options: string[];
}) {
  // гарантируем, что "all" точно есть и в начале
  const normalizedOptions = useMemo(() => {
    const set = new Set(options);
    set.add("all");
    const rest = [...set].filter((o) => o !== "all").sort((a, b) => a.localeCompare(b));
    return ["all", ...rest];
  }, [options]);

  const [category, setCategory] = useState<string>("all");
  const selectId = useId();

  const filtered = useMemo(() => {
    if (category === "all") return initialNews;
    return initialNews.filter((n) => n.category === category);
  }, [initialNews, category]);

  return (
    <div className="w-full px-4 mt-10 sm:mt-12 md:mt-16">
      {/* верхняя панель: на мобилке столбцом, на десктопе в строку */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <label htmlFor={selectId} className="text-sm text-muted-foreground">
            Category
          </label>
          <FilterSelect
            value={category}
            onChange={setCategory}
            options={normalizedOptions}
            placeholder="Choose Category"
            className="w-full sm:w-[220px]"
          />
        </div>

        <span className="text-sm text-muted-foreground sm:self-auto">
          Founded: <span className="font-medium text-foreground">{filtered.length}</span>
        </span>
      </div>

      {/* лента — один столбец, с адаптивными вертикальными отступами */}
      <div className="mx-auto w-full max-w-5xl space-y-6 md:space-y-8">
        {filtered.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            slug={post.slug}
            category={post.category}
            isPinned={post.isPinned}
            publishDate={post.publishDate}
            image={post.image}
          />
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border bg-card p-6 md:p-8 text-center text-sm text-muted-foreground">
            Found nothing <span className="font-medium">{category}</span>.
            Try another category
          </div>
        )}
      </div>
    </div>
  );
}
