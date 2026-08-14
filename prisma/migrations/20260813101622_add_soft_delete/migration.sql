-- AlterTable
ALTER TABLE "Company" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "EntrySheet" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "InternNote" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "MemoEntry" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN "deletedAt" DATETIME;
