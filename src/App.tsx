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
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} from "./api/clientApi";
import { 
  getAllAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
 } from "./api/accountApi";

import { 
  getAllCards,
  createCard, 
  updateCard,
  deleteCard,
} from "./api/cardApi";
import { 
  getAllTransactions,
  createTransaction,
} from "./api/transactionApi";



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
      console.log("New client added:", newClient);
   
    });
  };

  const handleUpdateClient = (id: number, updatedClientData: Client) => {
    updateClient(id, updatedClientData).then((response) => {
      const updatedClient = response.data;
      const updatedList = clients.map((c) => (c.id === updatedClient.id ? updatedClient : c));
      setClients(updatedList);
    
    });
  };

  const getTxsByAccountId = (accountId: number) => {
    return transactions.filter(
      tx => tx.accountBankingDes.id === accountId || tx.accountBankingSrc?.id === accountId
    )
  }
  const getAccountsByClientId = (clientId: number) => {
    return accounts.filter(acc => acc.client.id === clientId);
  }
  const getCardsByAccountId = (accountId: number) => {
    return cards.filter(card => card.accountBanking.id === accountId);
  }
  const handleDeleteClient = (id: number) => {
    
    if (getAccountsByClientId(id).length > 0){
      alert("Impossible de supprimer ce client. Il possède encore des comptes bancaires ou des cartes associées.");
      return;
    }
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce client ?",
      )
    ) {
      deleteClient(id).then(res =>{
        console.log("deleteClient response:", res.status);
        const updatedList = clients.filter((c) => c.id !== id);
        setClients(updatedList);
      })
      }
      if (selectedClientIdFilter === id) {
        setSelectedClientIdFilter(null);
      }
    }
   

  // --- ACCOUNT CRUD ---
  const handleAddAccount = (
    newAccData: Omit<AccountBankingRequest, "id" >,
  ) => {
    createAccount(newAccData).then((response) => {
      const newAcc = response.data;
      const updated = [...accounts, newAcc];
      setAccounts(updated);
      console.log("New account added:", newAcc);
    });
  };

  

  const handleUpdateAccount = (id: number, updated: AccountBankingRequest) => {
    updateAccount(id, updated).then((response) => {
      const updatedAccount = response.data;
      const updatedList = accounts.map((a) => (a.id === updatedAccount.id ? updatedAccount : a));
      setAccounts(updatedList);
      console.log("Account updated checked:", updatedAccount);
    });
  };

  const handleDeleteAccount = (id: number) => {
    if (
      window.confirm(
        "Voulez-vous supprimer ce compte ? Toutes les cartes bancaires et les transactions liées seront également supprimées.",
      )
    ) {
      deleteAccount(id).then(()=>{
        const update = accounts.filter((a) => a.id != id);
        setAccounts(update);
      });
    
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
      console.log("New card added:", newCard);
    });
  };

  const handleUpdateCard = (id: number, updated: CardBankingRequest) => {
    updateCard(id, updated).then((response) => {
      const updatedCard = response.data;
      const updatedList = cards.map((c) => (c.id === updatedCard.id ? updatedCard : c));
      setCards(updatedList);
      console.log("Card updated checked:", updatedCard);
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
    if (srcAcc?.currency !== desAcc.currency && transaction.type === "VIREMENT") {
      return { success: false, error: `InvalidOperationException: Les virements multi-devises ne sont pas supportés dans cette version. Compte source: ${srcAcc?.currency}, Compte destinataire: ${desAcc.currency}` };
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
      console.log("Transaction executed successfully:", newTx);
    }).catch((err) => {
      console.error("Transaction creation error:", err);
    });
    

    return { success: true };
  }

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
              />
            )}

            {currentTab === "clients" && (
              <ClientsPage
                clients={clients}
                onAddClient={handleAddClient}
                onUpdateClient={handleUpdateClient}
                onDeleteClient={handleDeleteClient}
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
