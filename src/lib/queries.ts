// все запросы храним тут

import { prisma } from "@/lib/db";
import { toNewsDTO } from "@/lib/mappers";

// Публичная лента - опубликованные, с опциональным фильтром по имени категории
export async function getPublishedNews(categoryName?: string) {
  const rows = await prisma.news.findMany({
    where: {
      draft: false,
      publishDate: { lte: new Date() },
      ...(categoryName ? { category: { name: categoryName } } : {}),
    },
    include: { category: true },
    orderBy: [
      { isPinned: "desc" },   // закрепленные выше
      { pinnedAt: "desc" },   // последние закрепы вверху
      { publishDate: "desc" } // свежие публикации
    ],
  });
  return rows.map(toNewsDTO);
}

// Категории для фильтров и форм
export async function getCategories() {
  return prisma.newsCategory.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

// Одна новость по slug для /news/[slug]
export async function getNewsBySlug(slug: string) {
  return prisma.news.findUnique({
    where: { slug },
    include: { category: true },
  });
}

// Черновики (для /admin)
export async function getDraftNews() {
  return prisma.news.findMany({
    where: { draft: true },
    include: { category: true },
    orderBy: { id: "desc" },
  });
}

// Все новости для админ листа (если нужен общий список, не только черновики)
export async function getAllNewsForAdmin() {
  return prisma.news.findMany({
    include: { category: true },
    orderBy: [{ isPinned: "desc" }, { id: "desc" }],
  });
}

// Пост для страницы редактирования (по id)
export async function getNewsForEdit(id: number) {
  if (!Number.isInteger(id)) return null;

  return prisma.news.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      categoryId: true,  // number | null
      isPinned: true,
      draft: true,
      publishDate: true,
      pinnedAt: true,
      image: true,
    },
  });
}
