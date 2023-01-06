/*
  Warnings:

  - You are about to drop the column `utc_timestamp` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Transaction_accountId_budgetId_utc_timestamp_idx";

-- DropIndex
DROP INDEX "Transaction_accountId_utc_timestamp_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "utc_timestamp",
ADD COLUMN     "utc_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Transaction_accountId_utc_datetime_idx" ON "Transaction"("accountId", "utc_datetime");

-- CreateIndex
CREATE INDEX "Transaction_accountId_budgetId_utc_datetime_idx" ON "Transaction"("accountId", "budgetId", "utc_datetime");
