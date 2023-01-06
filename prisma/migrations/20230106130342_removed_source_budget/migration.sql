/*
  Warnings:

  - You are about to drop the column `budgetId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MoneySource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_sourceId_fkey";

-- DropIndex
DROP INDEX "Transaction_accountId_budgetId_utc_datetime_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "budgetId",
DROP COLUMN "sourceId";

-- DropTable
DROP TABLE "Budget";

-- DropTable
DROP TABLE "MoneySource";
