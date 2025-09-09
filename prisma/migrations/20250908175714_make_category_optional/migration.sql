-- DropForeignKey
ALTER TABLE "public"."News" DROP CONSTRAINT "News_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."News" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."News" ADD CONSTRAINT "News_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."NewsCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
