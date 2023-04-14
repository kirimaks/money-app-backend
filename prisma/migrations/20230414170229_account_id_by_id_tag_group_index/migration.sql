/*
  Warnings:

  - A unique constraint covering the columns `[accountId,id]` on the table `TagGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TagGroup_accountId_id_key" ON "TagGroup"("accountId", "id");
