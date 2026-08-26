/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardOverview from "./components/DashboardOverview";
import ClientsPage from "./components/ClientsPage";
import AccountsPage from "./components/AccountsPage";
import CardsPage from "./components/CardsPage";
import TransactionsPage from "./components/TransactionsPage";

import { Client, AccountBanking, CardBanking, Transaction, AccountBankingRequest, CardBankingRequest, TransactionRequest } from "./types";
import {
  INITIAL_CLIENTS,
  INITIAL_ACCOUNTS,
  INITIAL_CARDS,
  INITIAL_TRANSACTIONS,
} from "./data";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClient
} from "./api/clientApi";
import { 
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  searchAccounts,
  getAccountsByClientId
 } from "./api/accountApi";

import { 
  getAllCards,
  getCardById,
  createCard, 
  updateCard,
  deleteCard,
  getCardsByAccountId,
  searchCards
} from "./api/cardApi";
import { 
  getAllTransactions,
  getTransactionById,
  createTransaction,
  getTransactionsByAccountId,
} from "./api/transactionApi";
import e from "express";
import { error } from "console";

// Helper: Generates unique standard compliant transaction references
function generateTxReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TXN-${dateStr}-${suffix}`;
}

export default function App() {
  const [currentTab, setTab] = useState<string>("dashboard");

  // Client database states
  const [clients, setClients] = useState<Client[]>([]);
  const [accounts, setAccounts] = useState<AccountBanking[]>([]);
  const [cards, setCards] = useState<CardBanking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Filtering states across tabs
  const [selectedClientIdFilter, setSelectedClientIdFilter] = useState<
    number | null
  >(null);
  const [selectedAccountIdFilter, setSelectedAccountIdFilter] = useState<
    number | null
  >(null);

  // 1. Initial State Load on mount
  useEffect(() => {
    
      getAllClients().then((res) => {
        setClients(res.data);
      });
      // Load training mock seed data
      getAllAccounts().then((res) => {
        setAccounts(res.data);
      });
      getAllCards().then((res) => {
        setCards(res.data);
      });
      getAllTransactions().then((res) => {
        setTransactions(res.data);
      });
      
  }, []);
      console.log("accounts:" ,accounts[0]?.client)
      console.log("clients" , clients)
      console.log("cards" , cards)
  // // 2. Automatically sync database changes to localStorage
  // useEffect(() => {
  //   if (clients.length > 0) {
  //     localStorage.setItem("bank_clients", JSON.stringify(clients));
  //   }
  // }, [clients]);

  // useEffect(() => {
  //   if (accounts.length > 0) {
  //     localStorage.setItem("bank_accounts", JSON.stringify(accounts));
  //   }
  // }, [accounts]);

  // useEffect(() => {
  //   if (cards.length > 0) {
  //     localStorage.setItem("bank_cards", JSON.stringify(cards));
  //   }
  // }, [cards]);

  // useEffect(() => {
  //   if (transactions.length > 0) {
  //     localStorage.setItem("bank_transactions", JSON.stringify(transactions));
  //   }
  // }, [transactions]);

  // Reset database state back to initial values
  const handleResetData = () => {
    if (
      window.confirm(
        "Voulez-vous réinitialiser la base de données locale d'entraînement ? Tous vos changements seront perdus.",
      )
    ) {
      getAllClients().then((res) => {
        setClients(res.data);
      });
      // Load training mock seed data
      getAllAccounts().then((res) => {
        setAccounts(res.data);
      });
      getAllCards().then((res) => {
        setCards(res.data);
      });
      getAllTransactions().then((res) => {
        setTransactions(res.data);
      });

      // localStorage.setItem("bank_clients", JSON.stringify(clients));
      // localStorage.setItem("bank_accounts", JSON.stringify(accounts));
      // localStorage.setItem("bank_cards", JSON.stringify(cards));
      // localStorage.setItem("bank_transactions", JSON.stringify(transactions));

      setSelectedClientIdFilter(null);
      setSelectedAccountIdFilter(null);
      setTab("dashboard");
    }
  };

  // --- CLIENT CRUD ---
  const handleAddClient = (
    newClientData: Omit<Client, "id" | "dateCreation">,
  ) => {
    createClient(newClientData).then((response) => {
      const newClient = response.data;
      const updated = [...clients, newClient];
      setClients(updated);
      // localStorage.setItem("bank_clients", JSON.stringify(updated));
    });
  };

  const handleUpdateClient = (id: number, updatedClientData: Client) => {
    updateClient(id, updatedClientData).then((response) => {
      const updatedClient = response.data;
      const updatedList = clients.map((c) => (c.id === updatedClient.id ? updatedClient : c));
      setClients(updatedList);
      //localStorage.setItem("bank_clients", JSON.stringify(updatedList));
    });
  };

  // const handleDeleteClient = (id: number) => {
  //   if (
  //     window.confirm(
  //       "Êtes-vous sûr de vouloir supprimer ce client ? Cette action supprimera en cascade tous ses comptes bancaires et ses cartes associées.",
  //     )
  //   ) {
  //     // Find all accounts to cascade delete cards
  //     const clientAccounts = accounts
  //       .filter((a) => a.clientId === id)
  //       .map((a) => a.id);

  //     const updatedClients = clients.filter((c) => c.id !== id);
  //     const updatedAccounts = accounts.filter((a) => a.clientId !== id);
  //     const updatedCards = cards.filter(
  //       (c) => !clientAccounts.includes(c.accountId),
  //     );

  //     setClients(updatedClients);
  //     setAccounts(updatedAccounts);
  //     setCards(updatedCards);

  //     localStorage.setItem("bank_clients", JSON.stringify(updatedClients));
  //     localStorage.setItem("bank_accounts", JSON.stringify(updatedAccounts));
  //     localStorage.setItem("bank_cards", JSON.stringify(updatedCards));

  //     if (selectedClientIdFilter === id) {
  //       setSelectedClientIdFilter(null);
  //     }
  //   }
   

  // --- ACCOUNT CRUD ---
  const handleAddAccount = (
    newAccData: Omit<AccountBankingRequest, "id" | "dateCreate">,
  ) => {
    createAccount(newAccData).then((response) => {
      const newAcc = response.data;
      const updated = [...accounts, newAcc];
      setAccounts(updated);
      //localStorage.setItem("bank_accounts", JSON.stringify(updated));
    });
  };

  

  const handleUpdateAccount = (id: number, updated: AccountBankingRequest) => {
    updateAccount(id, updated).then((response) => {
      const updatedAccount = response.data;
      const updatedList = accounts.map((a) => (a.id === updatedAccount.id ? updatedAccount : a));
      setAccounts(updatedList);
      //localStorage.setItem("bank_accounts", JSON.stringify(updatedList));
    });
  };

  const handleDeleteAccount = (id: number) => {
    if (
      window.confirm(
        "Voulez-vous supprimer ce compte ? Toutes les cartes bancaires liées seront également supprimées.",
      )
    ) {
      deleteAccount(id);
    
      if (selectedAccountIdFilter === id) {
        setSelectedAccountIdFilter(null);
      }
    }
  };

  // --- CARD CRUD ---
  const handleAddCard = (newCardData: Omit<CardBankingRequest, "id">) => {
    createCard(newCardData).then((response) => {
      const newCard = response.data;
      const updated = [...cards, newCard];
      setCards(updated);
      //localStorage.setItem("bank_cards", JSON.stringify(updated));
    });
  };

  const handleUpdateCard = (id: number, updated: CardBankingRequest) => {
    updateCard(id, updated).then((response) => {
      const updatedCard = response.data;
      const updatedList = cards.map((c) => (c.id === updatedCard.id ? updatedCard : c));
      setCards(updatedList);
      //localStorage.setItem("bank_cards", JSON.stringify(updatedList));
    });
  };

   const handleDeleteCard = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir annuler cette carte bancaire ?")
    ) {
      deleteCard(id).then(()=>{
        const update = cards.filter((c) => c.id != id);
        setCards(update);
      }); 
    }
  };

  // --- TRANSACTION ENGINE (Business exception checks mirroring Spring Boot) ---
  const handleExecuteTransaction = (transaction : Omit<TransactionRequest, "id">
  ): { success: boolean; error?: string } => {
    const desAcc = accounts.find((a) => a.id === transaction.accountBankingDes.id);
    const srcAcc = transaction.accountBankingSrc? accounts.find(a => a.id === transaction.accountBankingSrc?.id):  undefined;
    if (!desAcc) {
      return { success: false, error: `ResourceNotFoundException: Compte destinataire introuvable (ID: ${transaction.accountBankingDes.id}).` };
    }
    if (!desAcc.isActive) {
      return { success: false, error: `InvalidOperationException: Échec de transaction. Le compte destinataire [RIB: ${desAcc.RIB}] est suspendu/bloqué.` };
    }
    if(transaction.type === "VIREMENT" && transaction.amount > srcAcc?.sold){
      return {success: false, error: `solde insuffisant sur le compte ${srcAcc?.RIB} pour effectuer le virement.`}
    }
    if(transaction.type === "RETRAIT" && transaction.amount > desAcc.sold){
      return {success: false, error: `solde insuffisant sur le compte ${desAcc?.RIB} pour effectuer le retrait.`}
    }

    const desClient = clients.find((c) => c.id === desAcc.client.id);
    if (!desClient) {
      return { success: false, error: `ResourceNotFoundException: Échec de transaction. Titulaire du compte destinataire introuvable.` };
    }
    if (!desClient.isActive) {
      return { success: false, error: `InvalidOperationException: Transaction refusée. Le titulaire du compte [CIN: ${desClient.CIN}] est inactif.` };
    }
    console.log("Executing transaction nchof wach kayn chi mochkil:", transaction);
    createTransaction({
      type: transaction.type,
      amount: transaction.amount,
      reference: generateTxReference(),
      dateOperation: new Date().toISOString(),
      isValid: true,
      accountBankingDes: transaction.accountBankingDes,
      accountBankingSrc: transaction.accountBankingSrc,
    }).then((response) => {
      const newTx = response.data;
      const updatedTransactions = [newTx, ...transactions];
      setTransactions(updatedTransactions);
    }).catch((err) => {
      console.error("Transaction creation error:", err);
    });
    

    return { success: true };
  }

    // let updatedAccounts = [...accounts];

  //   if (type === "DEPOT") {
  //     updatedAccounts = updatedAccounts.map((a) => (a.id === destinationId ? { ...a, sold: a.sold + amount } : a));
  //   } else if (type === "RETRAIT") {
  //     if (desAcc.sold < amount) {
  //       return { success: false, error: `InsufficientFundsException: Solde insuffisant pour le débit. Solde disponible: ${desAcc.sold.toLocaleString()} ${desAcc.currency}, Requis: ${amount.toLocaleString()} ${desAcc.currency}.` };
  //     }
  //     updatedAccounts = updatedAccounts.map((a) => (a.id === destinationId ? { ...a, sold: a.sold - amount } : a));
  //   } else if (type === "VIREMENT") {
  //     if (!sourceId) {
  //       return { success: false, error: `InvalidOperationException: Compte source d'origine requis pour le virement.` };
  //     }

  //     const srcAcc = accounts.find((a) => a.id === sourceId);
  //     if (!srcAcc) {
  //       return { success: false, error: `ResourceNotFoundException: Compte d'origine introuvable (ID: ${sourceId}).` };
  //     }
  //     if (!srcAcc.isActive) {
  //       return { success: false, error: `InvalidOperationException: Échec de transfert. Le compte d'origine [RIB: ${srcAcc.RIB}] est désactivé.` };
  //     }

  //     const srcClient = clients.find((c) => c.id === srcAcc.clientId);
  //     if (!srcClient || !srcClient.isActive) {
  //       return { success: false, error: `InvalidOperationException: Transfert refusé. Le titulaire du compte d'origine est inactif.` };
  //     }

  //     if (srcAcc.currency !== desAcc.currency) {
  //       return { success: false, error: `InvalidOperationException: Les virements multi-devises ne sont pas supportés dans cette version. Compte source: ${srcAcc.currency}, Compte destinataire: ${desAcc.currency}` };
  //     }

  //     if (srcAcc.sold < amount) {
  //       return { success: false, error: `InsufficientFundsException: Solde insuffisant sur le compte source [RIB: ${srcAcc.RIB}]. Solde disponible: ${srcAcc.sold.toLocaleString()} ${srcAcc.currency}, Virement requis: ${amount.toLocaleString()} ${srcAcc.currency}.` };
  //     }

  //     updatedAccounts = updatedAccounts.map((a) => {
  //       if (a.id === sourceId) return { ...a, sold: a.sold - amount };
  //       if (a.id === destinationId) return { ...a, sold: a.sold + amount };
  //       return a;
  //     });
  //   }

  //   // Update local state immediately
  //   setAccounts(updatedAccounts);

  //   const txId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
  //   const newTx = {
  //     id: txId,
  //     type,
  //     amount,
  //     reference: generateTxReference(),
  //     dateOperation: new Date().toISOString(),
  //     isValid: true,
  //     accountBankingDesId: destinationId,
  //     accountBankingSrcId: type === "VIREMENT" ? sourceId : undefined,
  //   };

  //   setTransactions((prev) => [newTx, ...prev]);

  //   // Persist changes asynchronously (best-effort)
  //   const persist: Promise<any>[] = [];
  //   if (type === "VIREMENT") {
  //     const srcUpdated = updatedAccounts.find((a) => a.id === sourceId);
  //     const desUpdated = updatedAccounts.find((a) => a.id === destinationId);
  //     if (srcUpdated) persist.push(updateAccount(srcUpdated.id, srcUpdated));
  //     if (desUpdated) persist.push(updateAccount(desUpdated.id, desUpdated));
  //   } else {
  //     const desUpdated = updatedAccounts.find((a) => a.id === destinationId);
  //     if (desUpdated) persist.push(updateAccount(desUpdated.id, desUpdated));
  //   }
  //   persist.push(createTransaction(newTx));
  //   Promise.all(persist).catch((err) => console.error("Persist transaction error", err));

  //   return { success: true };
  // };

  const handleQuickDeposit = (accountId: number, amount: number , type : string) => {
    handleExecuteTransaction(
      {
        type: type,
        amount: amount,
        accountBankingDes: {id : accountId},
     
      }
      );
  };

  // // --- NAVIGATIONAL ROUTING SHORTCUTS ---
  // const handleViewAccounts = (clientId: number) => {
  //   setSelectedClientIdFilter(clientId);
  //   setTab("accounts");
  // };

  // const handleViewCards = (accountId: number) => {
  //   setSelectedAccountIdFilter(accountId);
  //   setTab("cards");
  // };

  // const handleViewTransactions = (accountId: number) => {
  //   setSelectedAccountIdFilter(accountId);
  //   setTab("transactions");
  // };
 
  return (
    <div className="flex h-screen bg-[#08090a] text-[#f7f8f8] font-sans antialiased overflow-hidden">
      {/* Sidebar fixed menu */}
      <Sidebar
        currentTab={currentTab}
        setTab={(tab) => {
          setTab(tab);
          // If moving between primary modules, do not force filters unless explicitly targeted
        }}
        clientsCount={clients.length}
        accountsCount={accounts.length}
        cardsCount={cards.length}
        transactionsCount={transactions.length}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <Header
          userEmail="elamrouchi.oualid@gmail.com"
          onResetData={handleResetData}
        />

        {/* Workspace scrolling layout */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#08090a]">
          <div className="max-w-6xl mx-auto">
            {currentTab === "dashboard" && (
              <DashboardOverview
                clients={clients}
                accounts={accounts}
                cards={cards}
                transactions={transactions}
                onNavigate={setTab}
                onQuickDeposit={handleQuickDeposit}
              />
            )}

            {currentTab === "clients" && (
              <ClientsPage
                clients={clients}
                onAddClient={handleAddClient}
                onUpdateClient={handleUpdateClient}
                //onDeleteClient={handleDeleteClient}
                //onViewAccounts={handleViewAccounts}
              />
            )}

            {currentTab === "accounts" && (
              <AccountsPage
                 accounts={accounts}
                 clients={clients}
                 clientIdFilter={selectedClientIdFilter}
                 onClearFilter={() => setSelectedClientIdFilter(null)}
                 onAddAccount={handleAddAccount}
                 onUpdateAccount={handleUpdateAccount}
                 onDeleteAccount={handleDeleteAccount}
                 //onViewCards={handleViewCards}
                // onViewTransactions={handleViewTransactions}
              />
            )}

            {currentTab === "cards" && (
              <CardsPage
                cards={cards}
                accounts={accounts}
                clients={clients}
                accountIdFilter={selectedAccountIdFilter}
                onClearFilter={() => setSelectedAccountIdFilter(null)}
                onAddCard={handleAddCard}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeleteCard}
              />
            )}

            {currentTab === "transactions" && (
              <TransactionsPage
                transactions={transactions}
                accounts={accounts}
                clients={clients}
                accountIdFilter={selectedAccountIdFilter}
                onClearFilter={() => setSelectedAccountIdFilter(null)}
                onExecuteTransaction={handleExecuteTransaction}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
