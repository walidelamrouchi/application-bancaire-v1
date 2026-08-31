/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Client {
  id: number;
  CIN: string; // Carte d'Identité Nationale (uppercase)
  name: string;
  email: string;
  phoneNumber: string;
  // ISO String
  isActive: boolean;
  dateCreate: string;
}

export interface AccountBanking {
  id: number;
  client: Client;        // objet imbriqué, pas clientId
  RIB: string;
  sold: number;
  type: "COURANT" | "EPARGNE";
  currency: "MAD" | "EUR" | "USD";
  isActive: boolean;
  dateCreate: string;
}
// Ce que le formulaire ENVOIE au backend (création/modification)

  export interface AccountBankingRequest {
    client: {id : number}; // envoie l'id du client lié, pas l'objet complet
    RIB: string;
    sold: number;
    type: "COURANT" | "EPARGNE";
    currency: "MAD" | "EUR" | "USD";
    isActive: boolean;
  }

  export interface CardBanking {
    id: number;
    PAN: string; // Primary Account Number (uppercase)
    dateExp: string; // YYYY-MM-DD
    ceilingDay: number; // Plafond journalier
    isActive: boolean;
    accountBanking: AccountBanking; // Linked Account id
  }
  export interface CardBankingRequest {
    PAN: string; // Primary Account Number (uppercase)
    dateExp: string; // YYYY-MM-DD
    ceilingDay: number; // Plafond journalier
    isActive: boolean;
    accountBanking: {id : number}; // envoie l'id du compte bancaire lié, pas l'objet complet 
    //accountId: number; //Jackson ne sait pas où le mettre
  }

export interface Transaction {
  id: number;
  type: "DEPOT" | "RETRAIT" | "VIREMENT";
  amount: number;
  reference: string; // Automatically generated reference e.g., TXN-20260701-A3F9K2
  dateOperation: string; // ISO String
  isValid: boolean;
  accountBankingSrc?: AccountBanking; // Source Account (only used for transfers/VIREMENT)
  accountBankingDes: AccountBanking; // Destination Account (only used for transfers/VIREMENT)
}
export interface TransactionRequest {
  type: "DEPOT" | "RETRAIT" | "VIREMENT";
  amount: number;
  reference: string; // Automatically generated reference e.g., TXN-20260701-A3F9K2
  dateOperation: string; // ISO String
  isValid: boolean;
  accountBankingDes: {id : number}; // Destination Account ID (all transactions have this)
  accountBankingSrc?: {id : number}; // Source Account ID (only used for transfers/VIREMENT)
}
export interface DailyTransactionStats {
  date: string;   // Jackson sérialise LocalDate en "2024-01-15"
  depot: number;
  retrait: number;
  virement: number;
}