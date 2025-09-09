
'use client'
import type { News } from "@/types/news";
import { useMemo, useState } from "react";
import { PostCard } from "@/components/ui/PostCard";
import { FilterSelect } from "@/components/ui/FilterSelect";



export default function TestClient({ initialNews }: { initialNews: News[]}) {

//  состояние выбранной категории
const [category, setCategory] = useState<string>('all');

// производное значение - список категорий
const categories = useMemo(() => {
  const set = new Set(initialNews.map((n) => n.category));
  return ['all', ...Array.from(set)];
}, [initialNews]);

// производное значение - отфильтрованные новости
const filtered = useMemo(() => {
  if (category === 'all') return initialNews;
  return initialNews.filter((n) => n.category === category);
}, [initialNews, category])

// вообще по идее нам не нужна условная отрисовка ниже, но на всякий сделал
  return (
    <div className="space-y-4">
      <FilterSelect value={category} onChange={setCategory} options={categories} />

      <div className="space-y-4">
        {filtered.length > 0 ? (
            filtered.map((post) => <PostCard key={post.id} {...post} />)) : (
            <p className="text-gray-500">Ничего не нашлось </p>
          )}
      </div>
    </div>
  );
}
