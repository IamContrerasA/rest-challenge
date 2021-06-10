/*
  Warnings:

  - Added the required column `emailToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailToken" TEXT NOT NULL,
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT E'PENDING';
