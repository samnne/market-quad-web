-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_sellerId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "buyerId" DROP NOT NULL,
ALTER COLUMN "sellerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
