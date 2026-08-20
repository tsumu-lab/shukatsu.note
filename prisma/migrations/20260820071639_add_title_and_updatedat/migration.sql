/*
  Warnings:

  - Added the required column `updatedAt` to the `InternNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InternNote" ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MemoEntry" ADD COLUMN     "title" TEXT;
