interface CategoryRequestBody {
    category_name: string;
}

interface CategoryDraft extends CategoryRequestBody {
    account_id: string;
}

interface CategoryDocument extends CategoryDraft {
    category_id: string;
}
