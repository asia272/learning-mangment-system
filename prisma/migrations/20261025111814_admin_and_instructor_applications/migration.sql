-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "InstructorApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "expertise" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstructorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstructorApplication_userId_idx" ON "InstructorApplication"("userId");

-- CreateIndex
CREATE INDEX "InstructorApplication_status_idx" ON "InstructorApplication"("status");

-- AddForeignKey
ALTER TABLE "InstructorApplication" ADD CONSTRAINT "InstructorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
