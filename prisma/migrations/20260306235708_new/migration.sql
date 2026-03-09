/*
  Warnings:

  - Added the required column `user_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "user_id" UUID NOT NULL;
