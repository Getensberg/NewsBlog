
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const email = String(session?.user?.email ?? "").toLowerCase();

  if (!session || (allow.length && !allow.includes(email))) {
    throw new Error("Not authorized");
  }
}

const f = createUploadthing();

export const ourFileRouter = {
  // один эндпоинт для загрузки картинок
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      await assertAdmin();
      return { userIsAdmin: true as const };
    })
    .onUploadComplete(async ({ file }) => {
      // вернём url на клиент
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
