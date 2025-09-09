import { z } from "zod";

/**
 * Универсальный парсер категории:
 * - undefined / пропущено  → undefined (не меняем поле в апдейте)
 * - ""                      → null (снять категорию)
 * - "12" или 12            → число > 0
 */
const categoryIdLoose = z
  .any()
  .transform((v) => {
    if (v === undefined) return undefined; // поле не прислали
    if (v === null || v === "") return null; // явное "без категории"
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  })
  .refine(
    (v) =>
      v === undefined || v === null || (Number.isInteger(v) && v > 0),
    "Некорректная категория"
  );

/** Очень лояльная проверка URL (или пустая строка, чтобы очистить) */
const imageField = z
  .string()
  .trim()
  .url({ message: "Некорректный URL изображения" })
  .or(z.literal(""))
  .optional();

/** Создание: обязательен только title, остальное — опционально */
export const createNewsSchema = z.object({
  title: z.string().trim().min(5, "Заголовок слишком короткий"),
  categoryId: categoryIdLoose.optional(), // undefined | null | number
  content: z
    .string()
    .transform((v) => (v ?? "").trim()) // храним без лишних пробелов
    .optional(),
  isPinned: z.boolean().optional(),
  image: imageField,
});

/** Обновление: всё опционально, поддерживаем снятие категории и очистку image */
export const updateNewsSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().trim().min(5, "Заголовок слишком короткий").optional(),
  categoryId: categoryIdLoose.optional(), // undefined | null | number
  content: z
    .string()
    .transform((v) => (v ?? "").trim())
    .optional(),
  isPinned: z.boolean().optional(),
  image: imageField,
});

/** Публикация: id обязателен, дату можем принять строкой */
export const publishNewsSchema = z.object({
  id: z.coerce.number().int().positive(),
  publishDate: z
    .union([z.string().datetime().optional(), z.string().optional(), z.date().optional()])
    .optional()
    .transform((v) => (typeof v === "string" && v ? new Date(v) : v)),
});

export const togglePinSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const deleteNewsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
