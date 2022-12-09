/*
  Warnings:

  - A unique constraint covering the columns `[tagGroupId,name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId,name]` on the table `TagGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tag_tagGroupId_name_key" ON "Tag"("tagGroupId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "TagGroup_accountId_name_key" ON "TagGroup"("accountId", "name");
