interface ModelCreateDocResponse<DocT> {
    success: boolean;
    document: DocT;
}

interface ModelSearchDocResponse<DocT> {
    found: boolean;
    document?: DocT;
}

interface ModelDeleteDocResponse<DocT> {
    success: boolean;
}
