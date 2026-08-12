import React, { useState, useEffect } from "react";
import { Client, AccountBanking, AccountBankingRequest } from "../types";
import { Search, Plus, Edit2, Trash2, X, CreditCard, ArrowLeftRight, Wallet, AlertCircle } from "lucide-react"; 
import { getAllAccounts  ,getAccountById , updateAccount , createAccount , searchAccounts , deleteAccount } from "../api/accountApi";

interface AccountsPageProps {
  accounts: AccountBanking[];
  clients: Client[];
  // clientIdFilter: number | null;
  // onClearFilter: () => void;
   onAddAccount: (account: AccountBankingRequest) => void;
  // onUpdateAccount: (id: number, account: AccountBankingRequest) => AccountBanking;
  // onDeleteAccount: (id: number) => void;
  // onViewCards: (accountId: number) => void;
  // onViewTransactions: (accountId: number) => void;
}

export default function AccountsPage({
  accounts,
  clients,
  // clientIdFilter,
  // onClearFilter,
   onAddAccount,
  // onUpdateAccount,
  // onDeleteAccount,
  // onViewCards,
  // onViewTransactions,
}: AccountsPageProps) {
  const [search, setSearch] = useState(""); // set value for search input
  const [isFormOpen, setIsFormOpen] = useState(false);
  //const [editingAccount, setEditingAccount] = useState<AccountBanking | null>(null);

  // Form Fields State
  const [clientId, setClientId] = useState<number>(0);
  const [RIB, setRIB] = useState("");
  const [sold, setSold] = useState<number>(0);
  const [type, setType] = useState<"COURANT" | "EPARGNE">("COURANT");
  const [currency, setCurrency] = useState<"MAD" | "EUR" | "USD">("MAD");
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Helper: auto-generate a valid-looking 24-digit RIB
  // const generateRandomRIB = () => {
  //   let rib = "00778000";
  //   for (let i = 0; i < 16; i++) {
  //     rib += Math.floor(Math.random() * 10).toString();
  //   }
  //   return rib;
  // };

  const handleOpenCreateAccount = ()=>{
    setClientId(clients[0]?.id || 0);
    setRIB("RIB");
    setSold(5000); // 5000 initial balance as a nice default
    setType("COURANT");
    setCurrency("MAD");
    setIsActive(true);
    setErrorMessage("");
    setIsFormOpen(true);
  }
  // const handleOpenCreate = () => {
  //   //setEditingAccount(null);
  //   setClientId(clients[0]?.id || 0);
  //   setRIB("RIB");
  //   setSold(5000); // 5000 initial balance as a nice default
  //   setType("COURANT");
  //   setCurrency("MAD");
  //   setIsActive(true);
  //   setErrorMessage("");
  //   setIsFormOpen(true);
  // };

  // const handleOpenEdit = (acc: AccountBanking) => {
  //   setEditingAccount(acc);
  //   setClientId(acc.client.id);
  //   setRIB(acc.RIB);
  //   setSold(acc.sold);
  //   setType(acc.type);
  //   setCurrency(acc.currency);
  //   setIsActive(acc.isActive);
  //   setErrorMessage("");
  //   setIsFormOpen(true);
  // };
    const handleSubmit = (e: React.FormEvent)=>{
      e.preventDefault();
      onAddAccount({
        clientId,
        RIB,
        sold,
        type,
        currency,
        isActive,
      });
      setIsFormOpen(false);
    }
    
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!clientId) {
  //     setErrorMessage("Veuillez sélectionner un client.");
  //     return;
  //   }

  //   if (!RIB || RIB.length !== 24) {
  //     setErrorMessage("Le RIB doit contenir exactement 24 chiffres.");
  //     return;
  //   }

  //   if (sold < 0) {
  //     setErrorMessage("Le solde initial ne peut pas être négatif.");
  //     return;
  //   }

  //   if (editingAccount) {
  //     onUpdateAccount(editingAccount.id, {
  //       clientId,
  //       RIB,
  //       sold, // In practice balance isn't edited directly, but this is a CRUD training MVP
  //       type,
  //       currency,
  //       isActive,
  //     });
  //   } else{
  //     // RIB duplicate check
  //     if (accounts.some(a => a.RIB === RIB)) {
  //       setErrorMessage("Ce RIB est déjà attribué à un autre compte.");
  //       return;
  //     }
  //     onAddAccount({
  //       clientId,
  //       RIB,
  //       sold,
  //       type,
  //       currency,
  //       isActive,
  //     });
  //   }

  //   setIsFormOpen(false);
  // };
  
  // const getClientID = (id: number) => {
  //   const account = accounts.find(acc => acc.id === id);
  //   return account ? account.client.id : "inconnu";
  // };
  // const getClientName = (id: number) => {
  //   const client = clients.find((c) => c.id === id);
  //   return client ? client.name : "Inconnu";
  // };
  // console.log("AccountsPage Rendered with accounts:", accounts);
  // console.log("AccountsPage Rendered with clients:", clients);
  // console.log("client of account id 1:", getClientID(1));
  
  // Filter & Search Logic
  const filteredAccounts = accounts.filter(acc=>{
    const matchesSearch = 
      acc.RIB.includes(search) || 
      acc.type.toLowerCase().includes(search.toLowerCase()) || 
      acc.client.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;

  })
  // const filteredAccounts = accounts.filter((acc) => {
  //   // 1. Client filter from prop
  //   if (clientIdFilter !== null && acc.client.id !== clientIdFilter) {
  //     return false;
  //   }

  //   // 2. Text Search
  //   const clientName = acc.client.name.toLowerCase();
  
  //   const matchesSearch =
  //     acc.RIB.includes(search) ||
  //     clientName.includes(search.toLowerCase()) ||
  //     acc.type.toLowerCase().includes(search.toLowerCase());

  //   return matchesSearch;
  // });

  //const activeFilterClientName = clientIdFilter !== null ? clients.find(c => c.id === clientIdFilter)?.name : "";

  return (
    <div className="space-y-6 animate-fade-in" id="accounts-crud-page">
      {/* Page Header */}
      <div className="flex justify-between items-center" id="accounts-header-block">
        <div>
          <h2 className="text-xl font-medium text-[#f7f8f8] tracking-tight">Comptes Bancaires</h2>
          <p className="text-xs text-[#8a8f98] mt-0.5">Administrer les types de comptes, les dépôts et les affectations de clients</p>
        </div>
        <button
          onClick={handleOpenCreateAccount}
          id="btn-create-account"
          className="bg-[#e4f222] text-[#08090a] text-xs font-[510] tracking-tight px-3 py-2 rounded-[6px] hover:bg-[#f0ff44] transition-colors duration-150 shadow-card flex items-center gap-1.5"
        >
          <Plus size={14} />
          Ouvrir un Compte
        </button> 
      </div>
      

      {/* Filter status card if filtered by Client ID */}
      {/* // {clientIdFilter !== null && ( */}
      {/* //   <div className="bg-[#5e6ad2]/10 border border-[#5e6ad2]/25 rounded-xl p-4 flex items-center justify-between" id="accounts-filter-banner">
      //     <div className="flex items-center gap-2.5">
      //       <div className="w-8 h-8 rounded-lg bg-[#5e6ad2]/15 flex items-center justify-center text-[#5e6ad2]">
      //         <Wallet size={16} />
      //       </div>
      //       <div>
      //         <p className="text-xs font-semibold text-[#f7f8f8]">Filtre par Client Actif</p>
      //         <p className="text-[11px] text-[#8a8f98]">Affichage des comptes bancaires de <span className="text-[#f7f8f8] font-mono">{activeFilterClientName}</span></p>
      //       </div>
      //     </div>
      //     <button */}
      {/* //       onClick={onClearFilter}
      //       id="btn-clear-accounts-filter"
      //       className="text-xs bg-[#383b3f] hover:bg-white/5 text-[#f7f8f8] border border-[#23252a] px-3 py-1.5 rounded-[6px] transition-all"
      //     >
      //       Effacer le filtre
      //     </button>
      //   </div>
      // )} */}

      {/* Search Toolbar */}
       <div className="flex items-center gap-3 bg-[#161718] p-3 rounded-xl border border-[#23252a]" id="accounts-toolbar">
         <div className="relative flex-1">
           <Search size={14} className="absolute left-3 top-2.5 text-[#62666d]" />
           <input
             type="text"
             placeholder="Rechercher par RIB, type de compte, nom du titulaire..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             id="accounts-search-input"
             className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs pl-9 pr-4 py-2 rounded-[6px] outline-none border border-transparent focus:border-[#5e6ad2]/50 transition-all"
           />
         </div>
         <div className="text-[11px] font-mono text-[#62666d]">
         Comptes filtrés: <span className="text-[#8a8f98] font-semibold">{accounts.length}</span>
         </div>
       </div>

       {/* Accounts Form Drawer */}
        {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="accounts-form-modal">
          <div className="bg-[#161718] border border-[#323334] rounded-xl shadow-overlay w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#23252a] bg-black/[0.15]">
              <h3 className="text-sm font-[510] text-[#f7f8f8]">
                Ouvrir un nouveau compte client
                {/* {editingAccount ? "Modifier le compte" : "Ouvrir un nouveau compte client"} */}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                id="btn-close-account-form"
                className="text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* {errorMessage && (
                <div className="bg-[#eb5757]/10 border border-[#eb5757]/20 rounded-[6px] p-3 flex items-start gap-2 text-xs text-[#eb5757]">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
               )} */}

               {/* Client Selector */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Titulaire (Client)</label>
                <select 
                  value={clientId}
                  onChange={(e) => setClientId(Number(e.target.value))}
                  id="form-account-client"
                  // disabled={!!editingAccount}
                  className="w-full bg-[#383b3f] text-[#f7f8f8] text-xs px-3 py-2 rounded-[6px] outline-none focus:shadow-focus transition-all disabled:opacity-50"
                  required
                >

                  <option value={0}>-- Sélectionner un client --</option> 
                  {clients.map((c) =>(
                  
                    <option key={c.id} value={c.id} disabled={!c.isActive}>
                      {c.name} {c.isActive ? "" : "(Bloqué)"} ({c.CIN})
                    </option>
                  
                  ))}
                </select>
              </div>

               {/* RIB Number */}
      {/*          <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-[11px] font-mono font-medium text-[#8a8f98] uppercase">RIB (24 Chiffres)</label>
                  {!editingAccount && ( 
                    <button
                      type="button"
                      id="btn-regen-rib"
                      onClick={() => setRIB(generateRandomRIB())}
                      className="text-[10px] text-[#5e6ad2] hover:underline"
                    >
                      Générer un RIB
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="RIB à 24 chiffres"
                  value={RIB}
                  onChange={(e) => setRIB(e.target.value.replace(/\D/g, "").slice(0, 24))}
                  maxLength={24}
                  id="form-account-rib"
                  disabled={!!editingAccount}
                  className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs px-3 py-2 rounded-[6px] outline-none focus:shadow-focus transition-all font-mono tracking-wider disabled:opacity-50"
                  required
                />
               </div> */}

               {/* Account Type and Currency */}
      {/*          <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Type de compte</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "COURANT" | "EPARGNE")}
                    id="form-account-type"
                    className="w-full bg-[#383b3f] text-[#f7f8f8] text-xs px-3 py-2 rounded-[6px] outline-none focus:shadow-focus transition-all"
                  >
                    <option value="COURANT">COURANT</option>
                    <option value="EPARGNE">ÉPARGNE</option>
                  </select>
                 </div> */}

      {/*            <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Devise</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as "MAD" | "EUR" | "USD")}
                    id="form-account-currency"
                    disabled={!!editingAccount}
                    className="w-full bg-[#383b3f] text-[#f7f8f8] text-xs px-3 py-2 rounded-[6px] outline-none focus:shadow-focus transition-all disabled:opacity-50"
                  >
                    <option value="MAD">MAD (Dirham)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (Dollar)</option>
                  </select>
                </div>
               </div> */}

               {/* Initial Sold (Balance) */}
      {/*          <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">
                  {editingAccount ? "Solde actuel (Lecture seule)" : "Solde Initial (Fonds)"}
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={sold}
                  onChange={(e) => setSold(Math.max(0, Number(e.target.value)))}
                  id="form-account-sold"
                  disabled={!!editingAccount}
                  className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs px-3 py-2 rounded-[6px] outline-none focus:shadow-focus transition-all font-mono disabled:opacity-50"
                  required
                />
               </div> */}

               {/* Status toggle */}
      {/*          <div className="flex items-center justify-between py-2 border-t border-[#23252a]">
                <div>
                  <span className="block text-xs font-medium text-[#f7f8f8]">Statut d'Activité</span>
                  <span className="block text-[10px] text-[#8a8f98]">Autoriser les débits et crédits sur ce compte</span>
                </div>
                <button
                  type="button"
                  id="form-account-status-toggle"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-150 outline-none ${
                    isActive ? "bg-[#27a644]" : "bg-[#62666d]"
                  }`}
                >
                  <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-150 ${
                    isActive ? "translate-x-4.5" : "translate-x-0"
                  }`} />
                </button>
               </div> */}

               {/* Form Buttons */}
      {/*          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#23252a]">
                <button
                  type="button"
                  id="form-account-btn-cancel"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-transparent text-[#8a8f98] text-xs font-medium px-3.5 py-1.5 rounded-[6px] hover:text-[#f7f8f8] hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  id="form-account-btn-submit"
                  className="bg-[#e4f222] text-[#08090a] text-xs font-[510] px-4 py-1.5 rounded-[6px] hover:bg-[#f0ff44] transition-all shadow-card"
                >
                  {editingAccount ? "Enregistrer" : "Créer le compte"}
                </button>
              </div>*/} 
            </form>
          </div>
        </div>
       )} 

      {/* Accounts Grid Data */}
      <div className="bg-[#161718] rounded-xl border border-[#23252a] overflow-hidden" id="accounts-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#23252a] bg-black/[0.15]">
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">RIB de Compte</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Titulaire</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Type</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Solde (BigDecimal)</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Création</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Statut</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b border-[#23252a] last:border-0 hover:bg-white/[0.01] transition-colors" id={`account-row-${account.id}`}>
                  <td className="p-3">
                    <span className="font-mono text-xs font-semibold text-[#8a8f98] block tracking-wide">{account.RIB}</span>
                    <span className="text-[10px] text-[#62666d] font-mono">ID: ACCOUNT-{account.id}</span>
                  </td>
                  <td className="p-3 text-xs">
                    <span className="text-[#f7f8f8] font-medium block">{account.client?.name}</span>
                    <span className="text-[10px] text-[#62666d] font-mono">CLIENT-{account.client?.id}</span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[510] text-[#5e6ad2] bg-[#5e6ad2]/10 border border-[#5e6ad2]/15">
                      {account.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-sm font-medium text-[#27a644] tracking-tight">
                    {account.sold} {account.currency}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-[#62666d]">
                    {new Date(account.dateCreate).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3">
                    {account.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10px] font-[510] text-[#27a644] bg-[#27a644]/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10px] font-[510] text-[#eb5757] bg-[#eb5757]/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#eb5757]" />
                        Bloqué
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Ledger Transactions */}
                      <button
                        //onClick={() => onViewTransactions(account.id)}
                        id={`btn-view-acc-ledg-${account.id}`}
                        className="p-1.5 text-[#8a8f98] hover:text-[#02b8cc] hover:bg-[#02b8cc]/10 rounded-[4px] transition-all"
                        title="Consulter l'historique des écritures"
                      >
                        <ArrowLeftRight size={14} />
                      </button>

                      {/* View associated bank cards */}
                      <button
                        //onClick={() => onViewCards(account.id)}
                        id={`btn-view-acc-cards-${account.id}`}
                        className="p-1.5 text-[#8a8f98] hover:text-[#5e6ad2] hover:bg-[#5e6ad2]/10 rounded-[4px] transition-all"
                        title="Consulter les cartes liées"
                      >
                        <CreditCard size={14} />
                      </button>

                      {/* Edit account details */}
                      <button
                        //onClick={() => handleOpenEdit(account)}
                        id={`btn-edit-account-${account.id}`}
                        className="p-1.5 text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/5 rounded-[4px] transition-all"
                        title="Modifier le compte"
                      >
                        <Edit2 size={14} />
                      </button>

                      {/* Delete account */}
                      <button
                        //onClick={() => onDeleteAccount(account.id)}
                        id={`btn-delete-account-${account.id}`}
                        className="p-1.5 text-[#eb5757]/70 hover:text-[#eb5757] hover:bg-[#eb5757]/10 rounded-[4px] transition-all"
                        title="Fermer et supprimer le compte"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {accounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#62666d] italic">
                    Aucun compte bancaire ne correspond aux critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
