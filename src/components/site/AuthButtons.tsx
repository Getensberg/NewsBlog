"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type Props = {
  session: any | null;
};

export function AuthButtons({ session }: Props) {
  if (!session) {
    return (
      <Button
        onClick={() => signIn("discord")}
        className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
        title="Log in Discord"
      >
        Connect
      </Button>
    );
  }

  const name = session.user?.name ?? "Профиль";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={session.user?.image ?? ""}
          alt={name}
          referrerPolicy="no-referrer"
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut()}
      >
        Log out
      </Button>
    </div>
  );
}
