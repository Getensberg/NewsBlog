import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.news.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post || post.draft) notFound();

  const publishLabel = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString("ru-RU")
    : "";

  return (
    <article className="mx-auto max-w-6xl px-4">
      <div className="relative h-[550px] w-full overflow-hidden rounded-2xl shadow-md">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
            Нет изображения
          </div>
        )}
      </div>

      {/* Заголовок + чето */}
      <header className="mt-6">
        <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {post.category && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-700">
              {post.category.name}
            </span>
          )}
          {publishLabel && <time>{publishLabel}</time>}
          {post.isPinned && (
            <span className="rounded bg-red-100 px-2 py-0.5 text-red-700">
              Закреплено
            </span>
          )}
        </div>
      </header>

      {/* Контент: узкая колонка + защита от «выползаний» */}
      <section className="mx-auto mt-8 w-full max-w-3xl">
        <div
          className={[
            // типографика
            "prose prose-neutral max-w-none",
            // перенос очень длинных слов/URL
            "break-words [overflow-wrap:anywhere]",
            // не даём медиавставкам растягивать контейнер
            "prose-img:rounded-xl prose-img:max-w-full prose-img:h-auto",
            "prose-video:max-w-full",
            // аккуратнее с преформатированным текстом
            "prose-pre:whitespace-pre-wrap prose-pre:break-words",
            // таблицы не разъезжаются
            "prose-table:w-full prose-table:table-auto",
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </section>
    </article>
  );
}
