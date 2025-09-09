
"use client";

import { signIn, signOut } from "next-auth/react";

type Props = {
  session: any | null;
};

export function AuthButtons({ session }: Props) {
  if (!session) {
    return (
      <button
        onClick={() => signIn("discord")}
        className="rounded bg-[#5865F2] px-3 py-1.5 text-sm font-medium text-white"
        title="Войти через Discord"
      >
        Connect
      </button>
    );
  }

  const name = session.user?.name ?? "Профиль";
  const image = session.user?.image as string | undefined;

  return (
    <div className="flex items-center gap-3">
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-8 w-8 rounded-full"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs">
          {name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <button
        onClick={() => signOut()}
        className="rounded border px-3 py-1.5 text-sm"
      >
        Log out
      </button>
    </div>
  );
}
