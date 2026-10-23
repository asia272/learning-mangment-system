-- AlterTable
ALTER TABLE "User" ADD COLUMN     "instructorVerifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "InstructorOtp" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InstructorOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstructorOtp_userId_createdAt_idx" ON "InstructorOtp"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "InstructorOtp" ADD CONSTRAINT "InstructorOtp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
