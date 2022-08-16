import {v4 as uuidv4} from 'uuid';


function generateTransaction(user_id:string, account_id:string):TransactionDraft {
    return {
        amount: Math.floor(Math.random() * 1000),
        category_id: uuidv4(),
        description: uuidv4(),
        spending_id: uuidv4(),
        saving_id: uuidv4(),
        budget_id: uuidv4(),
        user_id: user_id,
        account_id: account_id,
    }
}

export {generateTransaction}
