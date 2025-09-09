"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ensureUniqueSlug } from "@/lib/slug";
import { createNewsSchema, updateNewsSchema } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import type { Prisma } from "@/generated/prisma";

export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};


async function requireAdmin(): Promise<ActionState> {
  const session = await getServerSession(authOptions);
  if (!session) return { ok: false, message: "Not authorized" };

  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

  if (allow.length) {
    const email = String(session.user?.email ?? "").toLowerCase();
    if (!allow.includes(email)) return { ok: false, message: "Not authorized" };
  }
  return { ok: true };
}

function plainTextLength(html: string | undefined | null): number {
  if (!html) return 0;
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().length;
}

// CREATE
export async function createNewsAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const authz = await requireAdmin();
  if (!authz.ok) return authz;

  const parsed = createNewsSchema.safeParse({
    title: formData.get("title"),
    categoryId: formData.get("categoryId"),
    content: formData.get("content"),
    isPinned: formData.get("isPinned") === "on",
    image: formData.get("image"),
  });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { title, categoryId, content, isPinned, image: imageUrl } = parsed.data;

  const exists = await prisma.news.findFirst({
    where: { title: { equals: title, mode: "insensitive" } },
    select: { id: true },
  });
  if (exists) {
    return { ok: false, errors: { title: ["Новость с таким заголовком уже существует"] } };
  }

  const slug = await ensureUniqueSlug(title);

  const data: Prisma.NewsCreateInput = {
    title,
    slug,
    content: content ?? "",
    image: imageUrl && imageUrl.length > 0 ? imageUrl : null,
    draft: true,
    isPinned: !!isPinned,
    pinnedAt: isPinned ? new Date() : null,
    ...(parsed.data.categoryId ? { category: { connect: { id: parsed.data.categoryId } } } : {}),
  };

  try {
    await prisma.news.create({ data });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return { ok: false, errors: { title: ["Новость с таким заголовком уже существует"] } };
    }
    throw e;
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: "Новость создана как черновик" };
}

// EDIT / PUBLISH / UNPUBLISH - один акшен за всех (и все за него)
export async function editNewsAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const authz = await requireAdmin();
  if (!authz.ok) return authz;

  const intent = String(formData.get("intent") ?? "save"); // save | publish | unpublish

  const rawCategoryId = formData.get("categoryId");
  const normCategoryId =
  rawCategoryId == null || String(rawCategoryId).trim() === ""
    ? undefined
    : rawCategoryId;

  const rawImage = formData.get("image");
  const normImage =
  rawImage == null ? undefined : String(rawImage); // "" => удалить, непустая строка => URL

const parsed = updateNewsSchema.safeParse({
  id: formData.get("id"),
  title: formData.get("title"),
  categoryId: normCategoryId,
  content: formData.get("content"),
  isPinned: formData.get("isPinned") === "on",
  image: normImage,
});
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const {
    id,
    title,
    categoryId,             // number | undefined | null
    content,
    isPinned,
    image: imageUrl,         // string | "" | undefined
  } = parsed.data;

  const current = await prisma.news.findUnique({
    where: { id },
    select: {
      title: true,
      slug: true,
      draft: true,
      content: true,
      categoryId: true,
      image: true,
    },
  });
  if (!current) {
    return { ok: false, errors: { id: ["Новость не найдена"] } };
  }

  // Посчитаем будущие значения из формы до апдейта
  const nextTitle = title ?? current.title;
  const nextSlug =
    title && title !== current.title ? await ensureUniqueSlug(title, id) : undefined;

  const nextContent = content !== undefined ? content : current.content;

  let nextCategoryId: number | null | undefined;
  if (categoryId === undefined) nextCategoryId = current.categoryId;
  else nextCategoryId = categoryId; // может быть number или null

  let nextImage: string | null | undefined;
  if (imageUrl === undefined) nextImage = current.image;
  else nextImage = imageUrl.length > 0 ? imageUrl : null;     // "" -> null, URL -> URL

  // Если нужно опубликовать — валидируем будущие значения
  if (intent === "publish") {
    const errors: Record<string, string[]> = {};
    if (plainTextLength(nextContent) < 50) {
      errors.content = ["Контент должен быть не короче 50 символов (без HTML)."];
    }
    if (nextCategoryId == null) {
      errors.categoryId = ["Выберите категорию перед публикацией."];
    }
    if (!nextImage) {
      errors.image = ["Добавьте изображение перед публикацией."];
    }
    if (Object.keys(errors).length) {
      return { ok: false, errors, message: "Некорректные данные публикации." };
    }
  }

  // Собираем общее обновление полей (без изменения draft)
  const commonUpdate: Prisma.NewsUpdateInput = {
    ...(title !== undefined ? { title: nextTitle } : {}),
    ...(nextSlug ? { slug: nextSlug } : {}),
    ...(content !== undefined ? { content: nextContent } : {}),
    ...(typeof isPinned === "boolean" ? { isPinned, pinnedAt: isPinned ? new Date() : null } : {}),
    ...(imageUrl !== undefined ? { image: nextImage ?? null } : {}),
    ...(categoryId !== undefined
      ? nextCategoryId === null
        ? { category: { disconnect: true } }
        : { category: { connect: { id: Number(nextCategoryId) } } }
      : {}),
  };

  try {
    if (intent === "unpublish") {
      await prisma.news.update({
        where: { id },
        data: {
          ...commonUpdate,
          draft: true,
        },
      });
      revalidatePath("/");
      revalidatePath("/admin");
      return { ok: true, message: "Снято с публикации" };
    }

    if (intent === "publish") {
      await prisma.news.update({
        where: { id },
        data: {
          ...commonUpdate,
          draft: false,
          publishDate: new Date(),
        },
      });
      revalidatePath("/");
      revalidatePath("/admin");
      return { ok: true, message: "Опубликовано" };
    }

    // intent === "save"
    await prisma.news.update({
      where: { id },
      data: commonUpdate,
    });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return { ok: false, errors: { title: ["Новость с таким заголовком уже существует"] } };
    }
    throw e;
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: "Изменения сохранены" };
}

export async function publishNews(formData: FormData): Promise<void> {
  const authz = await requireAdmin();
  if (!authz.ok) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  // подтянем минимально нужные поля для валидаций
  const post = await prisma.news.findUnique({
    where: { id },
    select: { content: true, categoryId: true, image: true },
  });
  if (!post) return;

  const errors: string[] = [];
  if ((post.content ?? "").trim().replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").length < 50) {
    errors.push("Контент должен быть не короче 50 символов.");
  }
  if (post.categoryId == null) {
    errors.push("Выберите категорию перед публикацией.");
  }
  if (!post.image) {
    errors.push("Добавьте изображение перед публикацией.");
  }
  if (errors.length) {
    // вернемся на страницу редактирования с сообщением
    redirect(`/admin/edit/${id}?error=${encodeURIComponent(errors.join(" "))}`);
  }

  await prisma.news.update({
    where: { id },
    data: { draft: false, publishDate: new Date() },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function unpublishNews(formData: FormData): Promise<void> {
  const authz = await requireAdmin();
  if (!authz.ok) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.news.update({
    where: { id },
    data: { draft: true },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function togglePin(formData: FormData): Promise<void> {
  const authz = await requireAdmin();
  if (!authz.ok) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const post = await prisma.news.findUnique({
    where: { id },
    select: { isPinned: true },
  });
  if (!post) return;

  await prisma.news.update({
    where: { id },
    data: {
      isPinned: !post.isPinned,
      pinnedAt: !post.isPinned ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteNews(formData: FormData): Promise<void> {
  const authz = await requireAdmin();
  if (!authz.ok) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.news.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
}
