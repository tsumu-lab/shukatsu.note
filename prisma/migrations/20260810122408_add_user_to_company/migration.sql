/*
  Warnings:

  - Added the required column `userId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL DEFAULT 'cmsn3xsl8000029qxc4fgf0pi',
    "name" TEXT NOT NULL,
    "mypageUrl" TEXT,
    "mypageId" TEXT,
    "mypagePw" TEXT,
    "deadline" DATETIME,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "status" TEXT NOT NULL DEFAULT '検討中',
    "memo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("createdAt", "deadline", "id", "memo", "mypageId", "mypagePw", "mypageUrl", "name", "priority", "status") SELECT "createdAt", "deadline", "id", "memo", "mypageId", "mypagePw", "mypageUrl", "name", "priority", "status" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
