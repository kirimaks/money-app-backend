/*
  Warnings:

  - A unique constraint covering the columns `[accountId,id]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tag_accountId_id_key" ON "Tag"("accountId", "id");
