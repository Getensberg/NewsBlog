"use client";

import { useMemo, useState } from "react";
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
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (category === "all") return initialNews;
    return initialNews.filter((n) => n.category === category);
  }, [initialNews, category]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <FilterSelect value={category} onChange={setCategory} options={options} />
      </div>

      {/* ОДИН СТОЛБЕЦ: просто вертикальный стек */}
      <div className="mx-auto max-w-5xl space-y-8">
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
          <p className="text-gray-500">Ничего не нашлось</p>
        )}
      </div>
    </div>
  );
}
