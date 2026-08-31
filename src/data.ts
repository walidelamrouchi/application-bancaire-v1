import { Client, AccountBanking, CardBanking, Transaction } from "./types";


export const mockDailyStats = Array.from({ length: 20 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (19 - i));
  return {
    date: date.toISOString().split('T')[0], // "2026-08-15" — même format que LocalDate sérialisé
    depot: Math.floor(Math.random() * 30) + 10,
    retrait: Math.floor(Math.random() * 30) + 10,
    virement: Math.floor(Math.random() * 30) + 10,
  };
});


export const INITIAL_CLIENTS: Client[] = [
  {
    id: 1,
    CIN: "JM123456",
    name: "Oualid Elamrouchi",
    email: "elamrouchi.oualid@gmail.com",
    phoneNumber: "+212 612 345678",
    dateCreation: "2026-06-15T10:30:00Z",
    isActive: true,
  },
  {
    id: 2,
    CIN: "AE987654",
    name: "Sarah Bennani",
    email: "sarah.bennani@bank.ma",
    phoneNumber: "+212 698 765432",
    dateCreation: "2026-06-20T14:15:00Z",
    isActive: true,
  },
];

export const INITIAL_ACCOUNTS: AccountBanking[] = [
  {
    id: 1,
    RIB: "007780000123456789012301",
    sold: 45000.00,
    type: "COURANT",
    dateCreate: "2026-06-15T11:00:00Z",
    isActive: true,
    currency: "MAD",
    clientId: 1,
  },
  {
    id: 2,
    RIB: "007780000123456789012302",
    sold: 150000.00,
    type: "EPARGNE",
    dateCreate: "2026-06-16T09:00:00Z",
    isActive: true,
    currency: "MAD",
    clientId: 1,
  },
  {
    id: 3,
    RIB: "007780000987654321098701",
    sold: 8500.00,
    type: "COURANT",
    dateCreate: "2026-06-20T15:00:00Z",
    isActive: true,
    currency: "MAD",
    clientId: 2,
  },
];

export const INITIAL_CARDS: CardBanking[] = [
  {
    id: 1,
    PAN: "4532718293840291",
    dateExp: "2030-06-30",
    ceilingDay: 10000,
    isActive: true,
    accountId: 1,
  },
  {
    id: 2,
    PAN: "4532918239845521",
    dateExp: "2029-12-31",
    ceilingDay: 5000,
    isActive: true,
    accountId: 3,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    type: "DEPOT",
    amount: 50000,
    reference: "TXN-20260615-DEP83A",
    dateOperation: "2026-06-15T11:30:00Z",
    isValid: true,
    accountBankingDesId: 1,
  },
  {
    id: 2,
    type: "RETRAIT",
    amount: 5000,
    reference: "TXN-20260618-RET41B",
    dateOperation: "2026-06-18T16:20:00Z",
    isValid: true,
    accountBankingDesId: 1,
  },
  {
    id: 3,
    type: "VIREMENT",
    amount: 12000,
    reference: "TXN-20260625-VIR19C",
    dateOperation: "2026-06-25T14:10:00Z",
    isValid: true,
    accountBankingDesId: 3,
    accountBankingSrcId: 1,
  },
];
