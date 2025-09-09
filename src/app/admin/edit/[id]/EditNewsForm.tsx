"use client";

import { useActionState, useEffect, useState } from "react";
import type { ActionState } from "@/actions/news";
import {
  editNewsAction,
  publishNews,
  unpublishNews,
  togglePin,
  deleteNews,
} from "@/actions/news";
import { ImageUploader } from "@/components/upload/ImageUploader";

type EditPost = {
  id: number;
  title: string;
  content: string;
  categoryId: number | null;
  isPinned: boolean;
  draft: boolean;
  publishDate: string | Date | null;
  pinnedAt: string | Date | null;
  image: string | null;
};

type Category = { id: number; name: string };

export default function EditNewsForm({
  post,
  categories,
}: {
  post: EditPost;
  categories: Category[];
}) {
  // состояние для server action сохранения
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    editNewsAction,
    null
  );

  // Контролируемые - чтобы ничего не сбрасывалось визуально
  const [title, setTitle] = useState(post.title);
  const [categoryId, setCategoryId] = useState<string>(
    post.categoryId != null ? String(post.categoryId) : ""
  );
  const [content, setContent] = useState(post.content);
  const [isPinned, setIsPinned] = useState(post.isPinned);

  // изображение
  const [imageUrl, setImageUrl] = useState<string>(post.image ?? "");
  const [deleteImage, setDeleteImage] = useState<boolean>(false);
  useEffect(() => {
    if (deleteImage) setImageUrl("");
  }, [deleteImage]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/*  форма сохранения  */}
      <form id="edit-form" action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={post.id} />

        {/* image как скрытое поле ("" => удалить) */}
        <input type="hidden" name="image" value={deleteImage ? "" : imageUrl} />

        {/* Заголовок */}
        <div>
          <label className="block text-sm font-medium">Title *</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded border p-2"
          />
          {state?.errors?.title && (
            <p className="text-sm text-red-600">{state.errors.title[0]}</p>
          )}
        </div>

        {/* Категория */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">— no category —</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
          {state?.errors?.categoryId && (
            <p className="text-sm text-red-600">{state.errors.categoryId[0]}</p>
          )}
        </div>

        {/* изображение */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Image</label>

          {imageUrl ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                className="h-20 w-20 rounded object-cover border"
              />
              <span className="text-xs text-gray-600 break-all">{imageUrl}</span>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Choose image!</p>
          )}

          <div className={deleteImage ? "pointer-events-none opacity-50" : ""}>
            <ImageUploader
              onUploaded={(url) => {
                setDeleteImage(false);
                setImageUrl(url);
              }}
            />
          </div>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={deleteImage}
              onChange={(e) => setDeleteImage(e.target.checked)}
            />
            <span className="text-sm">Delete image</span>
          </label>

          {state?.errors?.image && (
            <p className="text-sm text-red-600">{state.errors.image[0]}</p>
          )}
        </div>

        {/* Контент */}
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-40 w-full rounded border p-2"
          />
          {state?.errors?.content && (
            <p className="text-sm text-red-600">{state.errors.content[0]}</p>
          )}
        </div>

        {/* закрепить */}
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="isPinned"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
          />
          <span className="text-sm">Pin</span>
        </label>

        {/* статусы */}
        <div className="text-xs text-gray-500 space-x-3">
          {!post.draft ? (
            <span>
              Published:{" "}
              {post.publishDate
                ? new Date(post.publishDate).toLocaleString("ru-RU")
                : "—"}
            </span>
          ) : (
            <span>Its draft</span>
          )}
          {post.isPinned && (
            <span>
              Pinned:{" "}
              {post.pinnedAt
                ? new Date(post.pinnedAt).toLocaleString("ru-RU")
                : "—"}
            </span>
          )}
        </div>

        {state?.message && (
          <p
            className={
              state.ok ? "text-sm text-green-700" : "text-sm text-red-600"
            }
          >
            {state.message}
          </p>
        )}

        {/* Кнопка сохранить этой формы */}
        <div className="flex justify-end">
          <button className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">
            Save
          </button>
        </div>
      </form>

      {/*  панель действий выпадающих кнопок */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Закрепить / открепить */}
        <form action={togglePin}>
          <input type="hidden" name="id" value={post.id} />
          <button
            type="submit"
            className="cursor-pointer rounded border px-3 py-2 text-sm hover:bg-gray-50"
          >
            {post.isPinned ? "Открепить" : "Закрепить"}
          </button>
        </form>

        {/* Опубликовать / В черновики */}
        {post.draft ? (
          <form action={publishNews}>
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              className="cursor-pointer rounded border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Publish
            </button>
          </form>
        ) : (
          <form action={unpublishNews}>
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              className="cursor-pointer rounded border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Move to draft
            </button>
          </form>
        )}

        {/* Удалить */}
        <form
          action={deleteNews}
          onSubmit={(e) => {
            if (!confirm("Удалить новость?")) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={post.id} />
          <button
            type="submit"
            className="cursor-pointer rounded border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </form>
      </div>

      <p className="text-xs text-gray-500">
        Подсказка: публикация через эти кнопки (как и в списке /admin) использует
        <br />
        **сохранённые** в базе данные. Если менял поля выше — нажми «Сохранить»,
        затем «Опубликовать».
      </p>
    </div>
  );
}
