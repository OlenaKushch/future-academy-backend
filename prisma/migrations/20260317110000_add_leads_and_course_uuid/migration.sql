-- AlterTable
ALTER TABLE "Course" ADD COLUMN "uuid" TEXT;

-- Backfill existing rows with deterministic placeholders before applying constraints
UPDATE "Course"
SET "uuid" = md5(random()::text || clock_timestamp()::text)
WHERE "uuid" IS NULL;

-- Apply constraints for public UUID identifier
ALTER TABLE "Course" ALTER COLUMN "uuid" SET NOT NULL;
CREATE UNIQUE INDEX "Course_uuid_key" ON "Course"("uuid");

-- CreateTable
CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "message" TEXT,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
  "courseId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lead"
ADD CONSTRAINT "Lead_courseId_fkey"
FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
