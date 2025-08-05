/*
  Warnings:

  - You are about to drop the column `concluded` on the `Enrollment` table. All the data in the column will be lost.
  - Added the required column `stripeProductId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "concluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeProductId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "concluded";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;
