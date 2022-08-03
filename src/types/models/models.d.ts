interface ModelCreateDocResponse<DocT> {
    success: boolean;
    document: DocT;
    errorMessage?: string;
}

interface ModelSearchDocResponse<DocT> {
    found: boolean;
    document?: DocT;
}

interface ModelDeleteDocResponse<DocT> {
    success: boolean;
}

interface ModelGetDocResponse<DocT> {
    found: boolean;
    document?: DocT;
}
