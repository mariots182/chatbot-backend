/*
  Warnings:

  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyType` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `ownerEmail` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `ownerPhone` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `rfc` on the `Company` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "companySuscrptionType" AS ENUM ('BASIC', 'PREMIUM', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
DROP COLUMN "companyType",
DROP COLUMN "contactEmail",
DROP COLUMN "contactName",
DROP COLUMN "contactPhone",
DROP COLUMN "ownerEmail",
DROP COLUMN "ownerName",
DROP COLUMN "ownerPhone",
DROP COLUMN "rfc",
ADD COLUMN     "phoneWhatsapp" TEXT;

-- DropEnum
DROP TYPE "CompanyType";

-- CreateTable
CREATE TABLE "CompanyLegalInformation" (
    "id" SERIAL NOT NULL,
    "ownerName" TEXT,
    "ownerPhone" TEXT,
    "ownerEmail" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "address" TEXT,
    "rfc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "CompanyLegalInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySubscription" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "subscriptionType" "companySuscrptionType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanySubscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyLegalInformation" ADD CONSTRAINT "CompanyLegalInformation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanySubscription" ADD CONSTRAINT "CompanySubscription_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
