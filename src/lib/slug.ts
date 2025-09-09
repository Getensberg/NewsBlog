import { prisma } from '@/lib/db'


// Преобразуем заголовок в slug, убираем все лишние и ставим -


function baseSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


// Генерирует уникальный slug для новости если slug занят, добавляет -2, -3 и т.д


export async function ensureUniqueSlug(
  title: string,
  excludeId?: number
): Promise<string> {
  const base = baseSlug(title);
  let candidate = base;
  let i = 1;

  while (true) {
    const exists = await prisma.news.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!exists) return candidate; // slug свободен => используем

    i += 1;
    candidate = `${base}-${i}`; // пробуем все base1,2,3 и тд
  }
}
