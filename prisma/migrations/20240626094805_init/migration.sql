/*
  Warnings:

  - You are about to drop the column `is_Verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `BasicCardBulletJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentBulletJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FreeImageCardBulletJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FreeObjectBulletJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListTextCardBulletJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReactionBulletJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskCardBulletJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiaryListCardBulletJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bullet_journals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `daily_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `reminders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BasicCardBulletJournal" DROP CONSTRAINT "BasicCardBulletJournal_bullet_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentBulletJournal" DROP CONSTRAINT "CommentBulletJournal_bullet_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentBulletJournal" DROP CONSTRAINT "CommentBulletJournal_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FreeImageCardBulletJournal" DROP CONSTRAINT "FreeImageCardBulletJournal_bullet_id_fkey";

-- DropForeignKey
ALTER TABLE "FreeObjectBulletJournal" DROP CONSTRAINT "FreeObjectBulletJournal_bullet_id_fkey";

-- DropForeignKey
ALTER TABLE "ListTextCardBulletJournal" DROP CONSTRAINT "ListTextCardBulletJournal_bullet_id_fkey";

-- DropForeignKey
ALTER TABLE "ReactionBulletJournal" DROP CONSTRAINT "ReactionBulletJournal_bullet_id_fkey";

-- DropForeignKey
ALTER TABLE "ReactionBulletJournal" DROP CONSTRAINT "ReactionBulletJournal_user_id_fkey";

-- DropForeignKey
ALTER TABLE "TaskCardBulletJournal" DROP CONSTRAINT "TaskCardBulletJournal_bullet_id_fkey";

-- DropForeignKey
ALTER TABLE "TaskCardBulletJournal" DROP CONSTRAINT "TaskCardBulletJournal_user_id_fkey";

-- DropForeignKey
ALTER TABLE "DiaryListCardBulletJournal" DROP CONSTRAINT "DiaryListCardBulletJournal_bullet_id_fkey";

-- DropForeignKey
ALTER TABLE "bullet_journals" DROP CONSTRAINT "bullet_journals_user_id_fkey";

-- DropForeignKey
ALTER TABLE "daily_reports" DROP CONSTRAINT "daily_reports_user_id_fkey";

-- AlterTable
ALTER TABLE "reminders" ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_Verified",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "BasicCardBulletJournal";

-- DropTable
DROP TABLE "CommentBulletJournal";

-- DropTable
DROP TABLE "FreeImageCardBulletJournal";

-- DropTable
DROP TABLE "FreeObjectBulletJournal";

-- DropTable
DROP TABLE "ListTextCardBulletJournal";

-- DropTable
DROP TABLE "ReactionBulletJournal";

-- DropTable
DROP TABLE "TaskCardBulletJournal";

-- DropTable
DROP TABLE "DiaryListCardBulletJournal";

-- DropTable
DROP TABLE "bullet_journals";

-- DropTable
DROP TABLE "daily_reports";

-- DropTable
DROP TABLE "tags";

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" JSONB NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_link_post" (
    "id" SERIAL NOT NULL,
    "image_link" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "image_link_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diary" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "diary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "random_quotes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "random_quotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_link_post" ADD CONSTRAINT "image_link_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diary" ADD CONSTRAINT "diary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "random_quotes" ADD CONSTRAINT "random_quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
