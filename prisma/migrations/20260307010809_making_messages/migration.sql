/*
  Warnings:

  - You are about to drop the column `buyer_id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `conversationID` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listingId,buyerId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyerId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "buyer_id",
DROP COLUMN "seller_id",
DROP COLUMN "title",
ADD COLUMN     "buyerId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sellerId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "conversationID",
DROP COLUMN "created",
DROP COLUMN "read",
DROP COLUMN "updated",
DROP COLUMN "user_id",
ADD COLUMN     "conversationId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "senderId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_listingId_buyerId_key" ON "Conversation"("listingId", "buyerId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("cid") ON DELETE CASCADE ON UPDATE CASCADE;
