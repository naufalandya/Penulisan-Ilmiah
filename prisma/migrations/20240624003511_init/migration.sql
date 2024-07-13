-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "BasicCardBulletJournal" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "image_link" TEXT,
    "bullet_id" INTEGER NOT NULL,
    "detail" JSONB NOT NULL,

    CONSTRAINT "BasicCardBulletJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentBulletJournal" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "bullet_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "CommentBulletJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeImageCardBulletJournal" (
    "id" SERIAL NOT NULL,
    "image_link" TEXT NOT NULL,
    "bullet_id" INTEGER NOT NULL,
    "detail" JSONB NOT NULL,

    CONSTRAINT "FreeImageCardBulletJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeObjectBulletJournal" (
    "id" SERIAL NOT NULL,
    "svg_content" TEXT NOT NULL,
    "bullet_id" INTEGER NOT NULL,
    "detail" JSONB NOT NULL,

    CONSTRAINT "FreeObjectBulletJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListTextCardBulletJournal" (
    "id" SERIAL NOT NULL,
    "content" JSON NOT NULL,
    "bullet_id" INTEGER NOT NULL,
    "detail" JSONB NOT NULL,

    CONSTRAINT "ListTextCardBulletJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionBulletJournal" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "bullet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReactionBulletJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskCardBulletJournal" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "deadline_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "bullet_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "TaskCardBulletJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryListCardBulletJournal" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "bullet_id" INTEGER NOT NULL,
    "detail" JSONB NOT NULL,

    CONSTRAINT "DiaryListCardBulletJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bullet_journals" (
    "id" SERIAL NOT NULL,
    "index_name" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "bullet_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_reports" (
    "id" SERIAL NOT NULL,
    "image_link" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "deadline_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" VARCHAR(150),
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "meta_profile_link" TEXT,
    "is_Verified" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "role" "ROLE" NOT NULL DEFAULT 'USER',
    "bio" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bullet_journals_index_name_key" ON "bullet_journals"("index_name");

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_followingId_key" ON "follows"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "BasicCardBulletJournal" ADD CONSTRAINT "BasicCardBulletJournal_bullet_id_fkey" FOREIGN KEY ("bullet_id") REFERENCES "bullet_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentBulletJournal" ADD CONSTRAINT "CommentBulletJournal_bullet_id_fkey" FOREIGN KEY ("bullet_id") REFERENCES "bullet_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentBulletJournal" ADD CONSTRAINT "CommentBulletJournal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeImageCardBulletJournal" ADD CONSTRAINT "FreeImageCardBulletJournal_bullet_id_fkey" FOREIGN KEY ("bullet_id") REFERENCES "bullet_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeObjectBulletJournal" ADD CONSTRAINT "FreeObjectBulletJournal_bullet_id_fkey" FOREIGN KEY ("bullet_id") REFERENCES "bullet_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListTextCardBulletJournal" ADD CONSTRAINT "ListTextCardBulletJournal_bullet_id_fkey" FOREIGN KEY ("bullet_id") REFERENCES "bullet_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionBulletJournal" ADD CONSTRAINT "ReactionBulletJournal_bullet_id_fkey" FOREIGN KEY ("bullet_id") REFERENCES "bullet_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionBulletJournal" ADD CONSTRAINT "ReactionBulletJournal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCardBulletJournal" ADD CONSTRAINT "TaskCardBulletJournal_bullet_id_fkey" FOREIGN KEY ("bullet_id") REFERENCES "bullet_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCardBulletJournal" ADD CONSTRAINT "TaskCardBulletJournal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryListCardBulletJournal" ADD CONSTRAINT "DiaryListCardBulletJournal_bullet_id_fkey" FOREIGN KEY ("bullet_id") REFERENCES "bullet_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bullet_journals" ADD CONSTRAINT "bullet_journals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
