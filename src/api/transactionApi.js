import api from "./axios";
import { mockDailyStats } from "../data";
export const getAllTransactions = () => api.get('/transactions');
export const getTransactionById = (id)=> api.get(`/transactions/${id}`);
export const getTransactionsByAccountId = (accountId) => api.get(`/transactions/account/${accountId}`);
export const createTransaction = (transactionData) => api.post('/transactions', transactionData);
export const getDailyStats  = async (days = 9) => {

  //   const response =  await api.get('/transactions/stats/daily', {
  //   params: { days }
  // });
  //return response.data;
  return mockDailyStats.slice(-days);
}
// src/api/mockData.js
