/*
  Warnings:

  - You are about to drop the column `inned` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "inned",
ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;
