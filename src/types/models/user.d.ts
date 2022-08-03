interface UserDraft {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    password: string;
    account_id: string;
    comment: string;
}

interface UserDocument extends UserDraft {
    record_id: string;
}
