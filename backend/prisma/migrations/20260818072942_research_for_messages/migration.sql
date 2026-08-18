/*
  Warnings:

  - You are about to drop the column `searchResults` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `searchSummary` on the `Conversation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "searchResults",
DROP COLUMN "searchSummary";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "searchResults" JSONB,
ADD COLUMN     "searchSummary" TEXT;
