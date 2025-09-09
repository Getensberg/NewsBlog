"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function ImageUploader({
  onUploaded,
  className = "",
}: {
  onUploaded: (url: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <UploadButton<OurFileRouter, "imageUploader">
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const fromServer = res?.[0]?.serverData as { url?: string } | undefined;
          const directUrl = res?.[0]?.url as string | undefined; // на всякий случай
          const url = fromServer?.url ?? directUrl;
          if (url) onUploaded(url);
        }}
        onUploadError={(e: Error) => alert(`Ошибка загрузки: ${e.message}`)}
        content={{
          button: "Загрузить изображение",
          allowedContent: "Изображение до 4MB",
        }}
        appearance={{
          button:
            "ut-upload-button h-9 rounded bg-black px-3 text-sm text-white hover:opacity-90",
          container: "ut-upload-container",
        }}
      />
    </div>
  );
}
