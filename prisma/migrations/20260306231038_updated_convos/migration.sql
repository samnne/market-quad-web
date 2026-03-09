/*
  Warnings:

  - You are about to drop the column `userUid` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `buyer_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userUid_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationID_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "userUid",
ADD COLUMN     "buyer_id" UUID NOT NULL,
ADD COLUMN     "seller_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("lid") ON DELETE CASCADE ON UPDATE CASCADE;
