-- CreateTable
CREATE TABLE "TransactionTags" (
    "transactionId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionTags_transactionId_tagId_key" ON "TransactionTags"("transactionId", "tagId");

-- AddForeignKey
ALTER TABLE "TransactionTags" ADD CONSTRAINT "TransactionTags_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTags" ADD CONSTRAINT "TransactionTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
