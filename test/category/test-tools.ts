import {randomBytes} from 'crypto';


function generateCategory():CategoryRequestBody {
    return {
        category_name: randomBytes(8).toString('hex'),
    }
}

export {generateCategory}
