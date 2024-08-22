/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `google_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "google_id" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Prediction" (
    "id" SERIAL NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "halftimeScoreHome" INTEGER NOT NULL,
    "halftimeScoreAway" INTEGER NOT NULL,
    "fulltimeScoreHome" INTEGER NOT NULL,
    "fulltimeScoreAway" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "inviteOnly" BOOLEAN NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PoolToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_matchId_userId_key" ON "Prediction"("matchId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_PoolToUser_AB_unique" ON "_PoolToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PoolToUser_B_index" ON "_PoolToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PoolToUser" ADD CONSTRAINT "_PoolToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PoolToUser" ADD CONSTRAINT "_PoolToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
