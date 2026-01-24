/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Course` table. All the data in the column will be lost.
  - Made the column `description` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "price" REAL NOT NULL,
    "minAge" INTEGER NOT NULL DEFAULT 8,
    "maxAge" INTEGER NOT NULL DEFAULT 99,
    "level" TEXT NOT NULL DEFAULT 'Новачок',
    "type" TEXT NOT NULL DEFAULT 'Курс',
    "duration" INTEGER NOT NULL DEFAULT 1
);
INSERT INTO "new_Course" ("description", "id", "price", "title") SELECT "description", "id", "price", "title" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
