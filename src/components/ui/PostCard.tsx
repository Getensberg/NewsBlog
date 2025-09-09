"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type PostCardProps = {
  id: number;
  title: string;
  slug: string;
  category: string;
  isPinned: boolean;
  publishDate: string | null;
  image: string | null;
  content?: string;
  pinnedAt?: string | null;
};

export function PostCard({
  slug,
  title,
  category,
  isPinned,
  image,
  publishDate,
}: PostCardProps) {
  return (
    <Link href={`/news/${slug}`} className="group block">
      <article className="relative w-full overflow-hidden rounded-2xl shadow-lg transition hover:shadow-2xl">
        {/* Блок-картинка с фиксированной высотой */}
        <div className="relative h-[550px] w-full">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" priority />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
              no image
            </div>
          )}

          <div className="absolute left-4 top-4 flex gap-2">
            <Badge>{category}</Badge>
            {isPinned && <Badge className="bg-red-600 text-white">Pinned</Badge>}
          </div>
        </div>

        {/* Текстовая часть */}
        <div className="bg-white p-6">
          <h2 className="text-2xl font-bold leading-snug group-hover:underline">
            {title}
          </h2>
          {publishDate && (
            <p className="mt-1 text-sm text-gray-500">
              {new Date(publishDate).toLocaleDateString("ru-RU")}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
