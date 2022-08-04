interface ModelResponse {
    errorMessage: string;
}

interface ModelCreateDocResponse<DocT> {
    success: boolean;
    document: DocT;
    errorMessage?: string;
}

interface ModelSearchDocResponse<DocT> extends ModelResponse {
    found: boolean;
    document?: DocT;
}

interface ModelDeleteDocResponse<DocT> extends ModelResponse {
    success: boolean;
}

interface ModelGetDocResponse<DocT> extends ModelResponse {
    found: boolean;
    document?: DocT;
}

interface ModelRequestOptions {
    controlHeader: string | undefined;
}
