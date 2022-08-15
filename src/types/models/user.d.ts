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
    user_id: string;
    password: {
        hash: string;
        salt: string;
        expires: number;
    };
}

interface PasswordInfo {
    hash: string;
    salt: string;
    expires: number;
}
