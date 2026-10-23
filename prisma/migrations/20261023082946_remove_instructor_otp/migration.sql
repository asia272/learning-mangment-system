/*
  Warnings:

  - You are about to drop the column `instructorVerifiedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `InstructorOtp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InstructorOtp" DROP CONSTRAINT "InstructorOtp_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "instructorVerifiedAt";

-- DropTable
DROP TABLE "InstructorOtp";
