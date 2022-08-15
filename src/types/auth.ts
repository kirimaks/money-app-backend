interface SignUpRequestBody {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    password: string;
    comment: string;
    account_name: string;
}

interface UserSessionInfo {
    anonymous: boolean;
    account_id: string;
    user_id: string;
}

interface RandomSessionInfo {
    account_id: string;
    user_id: string;
    cookie: string;
}
