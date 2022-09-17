import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';



function getTagId(): string {
    return crypto.randomBytes(4).toString('hex');
}

function getDefaultTags():Tag[] {
    return [
        {tag_name: 'first', tag_id: getTagId(), tag_icon: 'money'},
        {tag_name: 'second', tag_id: getTagId(), tag_icon: 'money'},
        {tag_name: 'third', tag_id: getTagId(), tag_icon: 'money'},
        {tag_name: 'tag 4', tag_id: getTagId(), tag_icon: 'money'},
    ];
}

function getDefaultSources():MoneySource[] {
    return [
        {source_name: 'Wallet', source_id: uuidv4(), source_icon: 'money'}
    ];
}

export { getDefaultTags, getDefaultSources }
