/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";

-- DropIndex
DROP INDEX "Transaction_accountId_categoryId_utc_timestamp_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "Category";
