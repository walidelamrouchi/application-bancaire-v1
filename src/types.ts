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
  clientId: number;
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
  accountId: number; // Linked Account id
}

export interface Transaction {
  id: number;
  type: "DEPOT" | "RETRAIT" | "VIREMENT";
  amount: number;
  reference: string; // Automatically generated reference e.g., TXN-20260701-A3F9K2
  dateOperation: string; // ISO String
  isValid: boolean;
  accountBankingDesId: number; // Destination Account ID (all transactions have this)
  accountBankingSrcId?: number; // Source Account ID (only used for transfers/VIREMENT)
}
