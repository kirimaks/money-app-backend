import type { FastifyRequest } from 'fastify';


type TransactionRequestQuery = {
    day_start: number;
};
type TransactionsForDayRequest = FastifyRequest<{ 
    Querystring: TransactionRequestQuery; 
}>;

export { TransactionsForDayRequest }
