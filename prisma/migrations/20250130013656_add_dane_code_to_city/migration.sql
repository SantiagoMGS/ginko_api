/*
  Warnings:

  - A unique constraint covering the columns `[daneCode]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `daneCode` to the `City` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "City" ADD COLUMN     "daneCode" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "City_daneCode_key" ON "City"("daneCode");
