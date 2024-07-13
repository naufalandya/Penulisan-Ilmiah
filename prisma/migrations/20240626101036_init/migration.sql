/*
  Warnings:

  - The `image_link` column on the `image_link_post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tags` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "image_link_post" DROP COLUMN "image_link",
ADD COLUMN     "image_link" TEXT[];

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];
