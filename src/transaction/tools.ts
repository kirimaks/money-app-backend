import dayjs from '../tools/dayjs';

import type { TransactionRepresentation, Transaction } from './transaction.types';
import type { TagRepresentation, TransactionTags } from '../tags/tags.types';


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

/*
async function createTransaction(name:string, amount:number, datetime:string, accountId:string, userId:string):Promise<TransactionRepresentation> {
}
*/

// export { transactionResponse, getNewTagsQuery, showData, createTransaction }
export { transactionResponse, getNewTagsQuery }
