/*
  Warnings:

  - Made the column `startsAt` on table `Sponsorship` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endsAt` on table `Sponsorship` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AdSlot" ADD COLUMN     "allowCustomShare" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxSponsors" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Sponsorship" ADD COLUMN     "creative" TEXT,
ADD COLUMN     "sharePct" INTEGER NOT NULL DEFAULT 100,
ALTER COLUMN "startsAt" SET NOT NULL,
ALTER COLUMN "endsAt" SET NOT NULL;
