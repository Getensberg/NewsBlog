import type { NewsDTO } from "@/types/news";

export function toNewsDTO(n: {
  id: number;
  title: string;
  slug: string;
  content: string;
  isPinned: boolean;
  publishDate: Date | null;
  pinnedAt: Date | null;
  image: string | null;
  category: { name: string } | null;
}): NewsDTO {
  return {
    id: n.id,
    title: n.title,
    slug: n.slug,
    category: n.category?.name ?? "Без категории",
    isPinned: n.isPinned,
    publishDate: n.publishDate ? n.publishDate.toISOString() : null,
    pinnedAt: n.pinnedAt ? n.pinnedAt.toISOString() : null,
    image: n.image ?? null,
  };
}
