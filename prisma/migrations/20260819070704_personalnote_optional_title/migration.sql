-- AlterTable
ALTER TABLE "PersonalNote" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "title" DROP NOT NULL;
