/*
  Warnings:

  - You are about to drop the column `is_finished` on the `diary` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `diary` table. All the data in the column will be lost.
  - You are about to drop the `note` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CATEGORY" AS ENUM ('LEARN', 'SPEECH');

-- DropForeignKey
ALTER TABLE "note" DROP CONSTRAINT "note_user_id_fkey";

-- AlterTable
ALTER TABLE "diary" DROP COLUMN "is_finished",
DROP COLUMN "is_public";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "category" "CATEGORY" NOT NULL;

-- DropTable
DROP TABLE "note";
