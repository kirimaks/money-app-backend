/*
  Warnings:

  - A unique constraint covering the columns `[accountId,id]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_accountId_id_key" ON "Category"("accountId", "id");
