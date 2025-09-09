import { prisma } from "@/lib/db";
import { toNewsDTO } from "@/lib/mappers";
import HomeClient from "./home-client";

export default async function HomePage() {
  const news = await prisma.news.findMany({
    where: { draft: false },
    orderBy: [
      { isPinned: "desc" },
      { pinnedAt: "desc" },
      { publishDate: "desc" },
    ],
    include: { category: true },
    // можно селектнуть только нужные поля
  });

  const categories = await prisma.newsCategory.findMany({
    orderBy: { name: "asc" },
  });

  const initialNews = news.map(toNewsDTO);
  const options = ["all", ...categories.map((c) => c.name)];

  return <HomeClient initialNews={initialNews} options={options} />;
}
