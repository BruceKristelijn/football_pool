/*
  Warnings:

  - Changed the type of `matchId` on the `Prediction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "matchId",
ADD COLUMN     "matchId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "externalId" INTEGER NOT NULL,
    "utcDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "matchday" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "group" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "homeTeamName" TEXT NOT NULL,
    "homeTeamShort" TEXT NOT NULL,
    "homeTeamCrest" TEXT NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "awayTeamName" TEXT NOT NULL,
    "awayTeamShort" TEXT NOT NULL,
    "awayTeamCrest" TEXT NOT NULL,
    "fullTimeHome" INTEGER,
    "fullTimeAway" INTEGER,
    "halfTimeHome" INTEGER,
    "halfTimeAway" INTEGER,
    "areaId" INTEGER NOT NULL,
    "areaName" TEXT NOT NULL,
    "areaCode" TEXT NOT NULL,
    "areaFlag" TEXT NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "competitionName" TEXT NOT NULL,
    "competitionCode" TEXT NOT NULL,
    "competitionType" TEXT NOT NULL,
    "competitionEmblem" TEXT NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "seasonStartDate" TIMESTAMP(3) NOT NULL,
    "seasonEndDate" TIMESTAMP(3) NOT NULL,
    "currentMatchday" INTEGER,
    "seasonWinner" TEXT,
    "referees" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_externalId_key" ON "Match"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_matchId_userId_key" ON "Prediction"("matchId", "userId");

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
