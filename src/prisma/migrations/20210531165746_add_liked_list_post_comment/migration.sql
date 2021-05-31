/*
  Warnings:

  - The `liked` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `liked` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "liked",
ADD COLUMN     "liked" INTEGER[];

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "liked",
ADD COLUMN     "liked" INTEGER[];
