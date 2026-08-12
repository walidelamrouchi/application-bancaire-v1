import api from "./axios";

export const getAllAccounts = () => api.get('/accounts');
export const getAccountById = (id) => api.get(`/accounts/${id}`);
export const getAccountsByClientId = (clientId) => api.get(`/accounts/client/${clientId}`);
export const createAccount = (accountData) => api.post('/accounts', accountData);
export const updateAccount = ( id , accountData) => api.put(`/accounts/${id}`, accountData);
export const deleteAccount = (id) => api.delete(`/accounts/${id}`);
export const searchAccounts = (keyword) => api.get(`/accounts/search?keyword=${keyword}`);