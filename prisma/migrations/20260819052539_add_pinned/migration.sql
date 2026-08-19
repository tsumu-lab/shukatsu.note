-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "inned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "EntrySheet" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InternNote" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MemoEntry" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PersonalNote" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;
