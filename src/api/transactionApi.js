import api from "./axios";

export const getAllTransactions = () => api.get('/transactions');
export const getTransactionById = (id)=> api.get(`/transactions/${id}`);
export const getTransactionsByAccountId = (accountId) => api.get(`/transactions/account/${accountId}`);
export const createTransaction = (transactionData) => api.post('/transactions', transactionData);