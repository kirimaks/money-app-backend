import {randomBytes} from 'crypto';


function getRandomString(length:number):string {
    return randomBytes(length/2).toString('hex');
}


export {getRandomString}
