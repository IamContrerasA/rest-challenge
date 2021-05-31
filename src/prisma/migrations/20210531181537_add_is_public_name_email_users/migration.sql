-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEmailPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNamePublic" BOOLEAN NOT NULL DEFAULT false;
