interface CategoryRequestBody {
    category_name: string;
}

interface CategoryDraft extends CategoryRequestBody {
    account_id: string;
}

interface CategoryDocument extends CategoryDraft {
    category_id: string;
}

type CreateCategoryProperties = {
    body: CategoryRequestBody;
};
type CreateCategoryRequest = FastifyRequest<CreateCategoryProperties>;
type CreateCategoryRequestHandler = (request:CreateCategoryRequest, reply:FastifyReply) => Promise<HttpError>;

type GetCategoryProperties = {
    params: {
        category_id: string;
    }
};
type GetCategoryRequest = FastifyRequest<GetCategoryProperties>;
type GetCategoryRequestHandler = (request:GetCategoryRequest, reply:FastifyReply) => Promise<HttpError>;

type DeleteCategoryProperties = {
    params: {
        category_id: string;
    }
};
type DeleteCategoryRequest = FastifyRequest<DeleteCategoryProperties>;
type DeleteCategoryRequestHandler = (request:DeleteCategoryRequest, reply:FastifyReply) => Promise<HttpError>;
