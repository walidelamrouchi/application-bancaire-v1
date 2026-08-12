import api from './axios';

export const getAllClients = ()=> api.get('/clients');
export const getClientById = (id)=> api.get(`/clients/${id}`);
export const createClient  = (clientData)=> api.post('/clients', clientData);
export const updateClient = ( id ,clientData )=> api.put(`/clients/${id}`, clientData);
export const deleteClient = (id)=> api.delete(`/clients/${id}`);
export const searchClient = (keyword)=> api.get(`/clients/search?keyword=${keyword}`);