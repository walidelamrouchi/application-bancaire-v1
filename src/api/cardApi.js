import api from "./axios";

export const getAllCards = () => api.get('/cards');
export const getCardById = (id) => api.get(`/cards/${id}`);
export const getCardsByAccountId = (accountId) => api.get(`/cards/account/${accountId}`);
export const createCard = (cardData) => api.post('/cards', cardData);
export const updateCard = (id, cardData) => api.put(`/cards/${id}`, cardData);
export const deleteCard = (id) => api.delete(`/cards/${id}`);
export const searchCards = (keyword) => api.get(`/cards/search?keyword=${keyword}`);