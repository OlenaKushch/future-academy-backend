/*
  Warnings:

  - You are about to drop the `CourseApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseApplication" DROP CONSTRAINT "CourseApplication_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseApplication" DROP CONSTRAINT "CourseApplication_userId_fkey";

-- DropTable
DROP TABLE "CourseApplication";
