/*
  Warnings:

  - Added the required column `updatedAt` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."News_title_key";

-- AlterTable
ALTER TABLE "public"."News" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- На случай, если вдруг где-то остался старый уникальный индекс Prisma на title
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM   pg_indexes
    WHERE  schemaname = 'public'
    AND    indexname = 'News_title_key'
  ) THEN
    DROP INDEX "News_title_key";
  END IF;
END
$$;

-- Регистронезависимый уникальный индекс
CREATE UNIQUE INDEX IF NOT EXISTS "News_title_ci_idx"
ON "News"(LOWER("title"));
