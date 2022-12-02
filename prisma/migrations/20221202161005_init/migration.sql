/*
  Warnings:

  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `amount_cents` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utc_timestamp` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Transaction_accountId_budgetId_timestamp_idx";

-- DropIndex
DROP INDEX "Transaction_accountId_categoryId_timestamp_idx";

-- DropIndex
DROP INDEX "Transaction_accountId_timestamp_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
DROP COLUMN "timestamp",
ADD COLUMN     "amount_cents" BIGINT NOT NULL,
ADD COLUMN     "utc_timestamp" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Transaction_accountId_categoryId_utc_timestamp_idx" ON "Transaction"("accountId", "categoryId", "utc_timestamp");

-- CreateIndex
CREATE INDEX "Transaction_accountId_utc_timestamp_idx" ON "Transaction"("accountId", "utc_timestamp");

-- CreateIndex
CREATE INDEX "Transaction_accountId_budgetId_utc_timestamp_idx" ON "Transaction"("accountId", "budgetId", "utc_timestamp");
