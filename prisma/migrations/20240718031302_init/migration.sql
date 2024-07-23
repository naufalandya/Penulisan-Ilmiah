/*
  Warnings:

  - You are about to drop the `random_quotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "random_quotes" DROP CONSTRAINT "random_quotes_user_id_fkey";

-- DropTable
DROP TABLE "random_quotes";
