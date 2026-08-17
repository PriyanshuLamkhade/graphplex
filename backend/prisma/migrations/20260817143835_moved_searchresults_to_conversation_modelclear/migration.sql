/*
  Warnings:

  - You are about to drop the column `searchResults` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "searchResults" JSONB,
ADD COLUMN     "searchSummary" TEXT;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "searchResults";
