"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createNewsAction, type ActionState } from "@/actions/news";
import { ImageUploader } from "@/components/upload/ImageUploader";

type Category = { id: number; name: string };

function SubmitButton() {
  // важный момент: useFormStatus должен быть ВНУТРИ дерева <form>
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex cursor-pointer items-center justify-center rounded bg-black px-4 py-2 text-white outline-none ring-offset-2 transition disabled:opacity-60 focus:ring-2"
    >
      {pending ? "Сохраняю..." : "Создать черновик"}
    </button>
  );
}

export default function CreateNewsForm({ categories }: { categories: Category[] }) {
  // укажем тип состояния для удобства
  const [state, formAction] = useActionState<ActionState | null, FormData>(createNewsAction, null);
  const [imageUrl, setImageUrl] = useState("");
  const [titleLen, setTitleLen] = useState(0);
  const [contentLen, setContentLen] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);

  // если экшен отработал успешно — сбросим форму и предпросмотр картинки
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setImageUrl("");
      setTitleLen(0);
      setContentLen(0);
    }
  }, [state?.ok]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mx-auto w-full max-w-xl space-y-6 overflow-hidden"
    >
      {/* Заголовок */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Заголовок *
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={5}
          placeholder="Напр. New features launch"
          className="mt-1 w-full rounded border px-3 py-2 outline-none ring-offset-2 focus:ring-2"
          onChange={(e) => setTitleLen(e.currentTarget.value.trim().length)}
          aria-invalid={!!state?.errors?.title}
          autoFocus
        />
        <div className="mt-1 flex items-center justify-between">
          {state?.errors?.title ? (
            <p className="text-sm text-red-600">{state.errors.title[0]}</p>
          ) : (
            <span className="text-xs text-gray-500">
              Только заголовок обязателен — остальное можно заполнить позже.
            </span>
          )}
          <span className="text-xs text-gray-500">{titleLen}/∞</span>
        </div>
      </div>

      {/* Категория (опционально) */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium">
          Категория (необязательно)
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue=""
          className="mt-1 w-full rounded border px-3 py-2 outline-none ring-offset-2 focus:ring-2"
          aria-invalid={!!state?.errors?.categoryId}
        >
          <option value="">— без категории —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {state?.errors?.categoryId && (
          <p className="mt-1 text-sm text-red-600">{state.errors.categoryId[0]}</p>
        )}
      </div>

      {/* Контент (опционально) */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Контент (необязательно)
        </label>
        <textarea
          id="content"
          name="content"
          placeholder="Черновик можно сохранить пустым и вернуться позже"
          className="mt-1 h-40 w-full resize-y rounded border px-3 py-2 outline-none ring-offset-2 focus:ring-2"
          onChange={(e) => setContentLen(e.currentTarget.value.trim().length)}
          aria-invalid={!!state?.errors?.content}
        />
        <div className="mt-1 flex items-center justify-between">
          {state?.errors?.content && (
            <p className="text-sm text-red-600">{state.errors.content[0]}</p>
          )}
          <span className="text-xs text-gray-500">{contentLen} символов</span>
        </div>
      </div>

      {/* Изображение */}
      <div>
        <label className="block text-sm font-medium">Изображение</label>

        {imageUrl ? (
          <div className="mt-2 flex items-center gap-3">
            <img
              src={imageUrl}
              alt=""
              className="h-16 w-16 shrink-0 rounded object-cover"
            />
            <button
              type="button"
              className="cursor-pointer text-sm text-red-600 underline"
              onClick={() => setImageUrl("")}
            >
              Удалить
            </button>
          </div>
        ) : null}

        {/* скрытое поле — уходит в FormData → в zod → в server action */}
        <input type="hidden" name="image" value={imageUrl} />

        <div className="mt-3">
          <ImageUploader onUploaded={setImageUrl} />
        </div>

        {state?.errors?.image && (
          <p className="mt-1 text-sm text-red-600">{state.errors.image[0]}</p>
        )}
      </div>

      {/* Закрепить */}
      <label className="inline-flex select-none items-center gap-2">
        <input type="checkbox" name="isPinned" />
        <span className="text-sm">Закрепить</span>
      </label>

      {/* Сообщение от экшена */}
      {state?.message && (
        <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-600"}>
          {state.message}
        </p>
      )}

      {/* Кнопка сабмита (внутри формы, чтобы useFormStatus видел контекст) */}
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
