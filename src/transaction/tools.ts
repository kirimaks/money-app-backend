import dayjs from '../tools/dayjs';

import type { TransactionRepresentation, Transaction, CreateTransactionTool } from './transaction.types';
import type { TransactionTags } from '../tags/tags.types';


function transactionResponse(
  transaction: Transaction,
): TransactionRepresentation {
  return {
    id: transaction.id,
    name: transaction.name,
    amount: Number(transaction.amount_cents) / 100,
    datetime: dayjs.utc(transaction.utc_datetime).format(),
    tags: transaction.TransactionTags.map((t2tag:TransactionTags) => ({
      id: t2tag.tagId,
      name: t2tag.tag.name,
      tagGroupId: t2tag.tag.tagGroupId,
      iconName: t2tag.tag.iconName,
    })),
  };
}

function getNewTagsQuery(tags: string[]) {
  return tags.map((tagId) => {
    return { tagId: tagId };
  });
}

const createTransaction:CreateTransactionTool = async ({ 
    prisma, name, amount, datetime, accountId, userId, tagIds 
  }):Promise<Transaction> => {

      const datetimePrepared = new Date(datetime);
      const amountPrepared = Math.round(Math.abs(amount) * 100);
      const newTransactionPayload = {
        data: {
          name: name,
          amount_cents: amountPrepared,
          utc_datetime: datetime,
          account: {
            connect: {
              id: accountId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          TransactionTags: {},
        },
        include: {
          TransactionTags: {
            include: {
              tag: true,
            },
          },
        },
      };

      if (tagIds && tagIds.length > 0) {
        const newTagsQuery = getNewTagsQuery(tagIds);

        newTransactionPayload.data.TransactionTags = {
          create: newTagsQuery,
        };
      }

      const transaction = await prisma.transaction.create(
        newTransactionPayload,
      );

      return transaction;
}

export { transactionResponse, createTransaction }
