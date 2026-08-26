import React, { useState } from "react";
import { Client, AccountBanking, Transaction, TransactionRequest } from "../types";
import { Search, ArrowRightLeft, ArrowUpRight, ArrowDownLeft, X, AlertCircle, CheckCircle2, History } from "lucide-react";
import { ref } from "process";

interface TransactionsPageProps {
  transactions: Transaction[];
  accounts: AccountBanking[];
  clients: Client[];
  accountIdFilter: number | null;
  onClearFilter: () => void;
  onExecuteTransaction: (
    transaction: TransactionRequest
  ) => { success: boolean; error?: string };
}

export default function TransactionsPage({
  transactions,
  accounts,
  clients,
  accountIdFilter,
  onClearFilter,
  onExecuteTransaction,
}: TransactionsPageProps) {
  // Simulator State
  const [type, setType] = useState<"DEPOT" | "RETRAIT" | "VIREMENT">("DEPOT");
  const [amount, setAmount] = useState<number>(0);
  const [desAccountId, setDesAccountId] = useState<number>(0);
  const [srcAccountId, setSrcAccountId] = useState<number>(0);

  // Status Feedback
  const [errorFeedback, setErrorFeedback] = useState("");
  const [successFeedback, setSuccessFeedback] = useState("");

  // Search Ledger State
  const [search, setSearch] = useState("");

  // Helper to get client name
  const getClientNameByAccountId = (id: number) => {
    try {
      const acc = accounts.find(a => a.id === id);
      if (!acc) return "Inconnu";
      const client = clients.find(c => c.id === acc.client.id);
      return client ? client.name : "Inconnu";
    } catch (e) {
      console.error("Error finding client for account:", e);
      return "Inconnu";
    }
  };
  console.log("destAccountId:", desAccountId, "srcAccountId:", srcAccountId, "amount:", amount);
  console.log("accounts transactions:", accounts);

  // const getClientNameByAccountId = (id: number) => {
  //   const acc = accounts.find(a => a.id === id);
  //   if (!acc) return "Inconnu";
  //   const client = clients.find(c => c.id === acc.client.id);
  //   return client ? client.name : "Inconnu";
  // };

  const getAccountRIB = (id: number) => {
    const acc = accounts.find(a => a.id === id);
    return acc ? acc.RIB : `ACC-${id}`;
  };

  // Submit Simulator Operation
  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback("");
    setSuccessFeedback("");

    if (amount <= 0) {
      setErrorFeedback("InvalidOperationException: Le montant de la transaction doit être supérieur à 0.");
      return;
    }

    if (!desAccountId) {
      setErrorFeedback("InvalidOperationException: Compte destinataire obligatoire.");
      return;
    }

    if (type === "VIREMENT" && !srcAccountId) {
      setErrorFeedback("InvalidOperationException: Compte d'origine (source) obligatoire pour un virement.");
      return;
    }

    if (type === "VIREMENT" && srcAccountId === desAccountId) {
      setErrorFeedback("InvalidOperationException: Les comptes source et destinataire doivent être différents.");
      return;
    }

    // Execute through parent unified state machine
    const res = onExecuteTransaction(
      {
        type,
        amount,
        reference: `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        dateOperation: new Date().toISOString(),
        accountBankingDes: { id: desAccountId },
        isValid: true,
        accountBankingSrc: type === "VIREMENT" ? { id: srcAccountId } : undefined,
      }
    );

    if (res.success) {
      setSuccessFeedback(`Transaction validée et enregistrée avec succès ! Les comptes ont été débités/crédités.`);
      setAmount(0); // Reset amount on success
      console.log("Transaction executed successfully:", { type, amount, desAccountId, srcAccountId  });
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessFeedback(""), 5000);
    } else {
      setErrorFeedback(res.error || "Une erreur inattendue est survenue.");
    }
  };

  // Search & Filter History
  const filteredTransactions = transactions.filter((tx) => {
    // 1. Account RIB Filter from prop
    if (accountIdFilter !== null) {
      if (tx.accountBankingDes.id !== accountIdFilter && tx.accountBankingSrc.id !== accountIdFilter) {
        return false;
      }
    }

    // 2. Search textbox matching RIB, reference or Client name
    const matchesSearch =
      tx.reference.toLowerCase().includes(search.toLowerCase()) ||
      getAccountRIB(tx.accountBankingDes.id).includes(search) ||
      (tx.accountBankingSrc.id && getAccountRIB(tx.accountBankingSrc.id).includes(search)) ||
      getClientNameByAccountId(tx.accountBankingDes.id).toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  // Sort transactions by date descending (most recent first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime()
  );

  const activeFilterRIB = accountIdFilter !== null ? getAccountRIB(accountIdFilter) : "";

  return (
    <div className="space-y-6 animate-fade-in" id="transactions-sim-page">
      {/* Title */}
      <div>
        <h2 className="text-xl font-medium text-[#f7f8f8] tracking-tight">Console de Transactions & Mouvements</h2>
        <p className="text-xs text-[#8a8f98] mt-0.5">Simulateur d'opérations bancaires à double-sens (@Transactional Spring Boot logic simulation)</p>
      </div>

      {/* Filter banner if active */}
      {accountIdFilter !== null && (
        <div className="bg-[#02b8cc]/10 border border-[#02b8cc]/25 rounded-xl p-4 flex items-center justify-between" id="transactions-filter-banner">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#02b8cc]/15 flex items-center justify-center text-[#02b8cc]">
              <History size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#f7f8f8]">Mouvements du Compte Filtré</p>
              <p className="text-[11px] text-[#8a8f98]">Affichage des écritures pour le RIB: <span className="text-[#f7f8f8] font-mono">{activeFilterRIB}</span></p>
            </div>
          </div>
          <button
            onClick={onClearFilter}
            id="btn-clear-transactions-filter"
            className="text-xs bg-[#383b3f] hover:bg-white/5 text-[#f7f8f8] border border-[#23252a] px-3 py-1.5 rounded-[6px] transition-all"
          >
            Effacer le filtre
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="transactions-grid-split">
        {/* Left Column: Operation Simulation Console (1 Card) */}
        <div className="lg:col-span-1 space-y-4" id="simulation-console-container">
          <div className="bg-[#161718] border border-[#23252a] rounded-xl p-5 space-y-4 shadow-card">
            <div className="border-b border-[#23252a] pb-3">
              <h3 className="text-xs font-[510] text-[#f7f8f8] uppercase tracking-wider">Console d'Opérations</h3>
              <p className="text-[10px] text-[#62666d]">Simulateur de flux transactionnel local</p>
            </div>

            {/* Custom Form feedback indicators */}
            {errorFeedback && (
              <div className="bg-[#eb5757]/10 border border-[#eb5757]/20 rounded-[6px] p-3 text-xs text-[#eb5757] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>Exception Métier</span>
                </div>
                <p className="font-mono text-[10px] leading-relaxed break-words">{errorFeedback}</p>
              </div>
            )}

            {successFeedback && (
              <div className="bg-[#27a644]/10 border border-[#27a644]/20 rounded-[6px] p-3 text-xs text-[#27a644] flex gap-2">
                <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
                <span className="text-[11px]">{successFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSimulate} className="space-y-4">
              {/* Type Selection Tabs */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-medium text-[#8a8f98] uppercase">Type de transaction</label>
                <div className="grid grid-cols-3 gap-1 bg-[#0f1011] p-1 rounded-[6px] border border-[#23252a]">
                  {["DEPOT", "RETRAIT", "VIREMENT"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      id={`tab-tx-type-${type}`}
                      onClick={() => {
                        setType(type as any);
                        setErrorFeedback("");
                        setSuccessFeedback("");
                      }}
                      className={`py-1.5 rounded-[4px] text-[10px] font-semibold transition-all uppercase ${
                        type === type
                          ? "bg-[#383b3f] text-[#f7f8f8] border border-white/5 shadow-sm"
                          : "text-[#62666d] hover:text-[#8a8f98]"
                      }`}
                    >
                      {type === "DEPOT" && "Dépôt"}
                      {type === "RETRAIT" && "Retrait"}
                      {type === "VIREMENT" && "Virement"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Account (Shown only for transfers / VIREMENT) */}
              {type === "VIREMENT" && (
                <div className="space-y-1.5 animate-slide-down">
                  <label className="block text-[10px] font-mono font-medium text-[#8a8f98] uppercase">Compte d'origine (Source)</label>
                  <select
                    value={srcAccountId}
                    onChange={(e) => setSrcAccountId(Number(e.target.value))}
                    id="form-tx-src-account"
                    className="w-full bg-[#383b3f] text-[#f7f8f8] text-xs px-2.5 py-1.5 rounded-[6px] outline-none focus:shadow-focus transition-all"
                    required
                  >
                    <option value={0}>-- Sélectionner le compte à débiter --</option>
                    {accounts.map((acc) => {
                      const ownerName = getClientNameByAccountId(acc.id);
                      return (
                        <option key={acc.id} value={acc.id} disabled={!acc.isActive}>
                          {ownerName} ({acc.RIB.slice(-4)}) — {acc.sold.toLocaleString()} {acc.currency}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Destination Account (all transactions have this) */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-medium text-[#8a8f98] uppercase">
                  {type === "DEPOT"
                    ? "Compte Bénéficiaire (Crédit)"
                    : type === "RETRAIT"
                    ? "Compte Titulaire (Débit)"
                    : "Compte Destinataire (Crédit)"}
                </label>
                <select
                  value={desAccountId}
                  onChange={(e) => setDesAccountId(Number(e.target.value))}
                  id="form-tx-des-account"
                  className="w-full bg-[#383b3f] text-[#f7f8f8] text-xs px-2.5 py-1.5 rounded-[6px] outline-none focus:shadow-focus transition-all"
                  required
                >
                  <option value={0}>
                    {type === "DEPOT"
                      ? "-- Sélectionner le compte à créditer --"
                      : type === "RETRAIT"
                      ? "-- Sélectionner le compte à débiter --"
                      : "-- Sélectionner le compte bénéficiaire --"}
                  </option>
                  {accounts.map((acc) => {
                    const ownerName = getClientNameByAccountId(acc.id);
                    return (
                      <option key={acc.id} value={acc.id} disabled={!acc.isActive}>
                        {ownerName} ({acc.RIB.slice(-4)}) — {acc.sold.toLocaleString()} {acc.currency}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Amount field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-medium text-[#8a8f98] uppercase">Montant de l'opération</label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="2500.00"
                    value={amount || ""}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                    id="form-tx-amount"
                    className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs px-3 py-1.5 rounded-[6px] outline-none focus:shadow-focus transition-all font-mono font-semibold"
                    required
                  />
                  <div className="absolute right-3 top-2 text-[10px] text-[#62666d] font-mono">
                    {desAccountId ? (accounts.find(a => a.id === desAccountId)?.currency || "MAD") : "MAD"}
                  </div>
                </div>
              </div>

              {/* Action submit button */}
              <button
                type="submit"
                id="form-tx-btn-submit"
                className="w-full bg-[#e4f222] text-[#08090a] text-xs font-[510] tracking-tight py-2 rounded-[6px] hover:bg-[#f0ff44] transition-all shadow-card uppercase flex items-center justify-center gap-1.5"
              >
                {type === "DEPOT" && (
                  <>
                    <ArrowDownLeft size={14} />
                    Valider le Dépôt
                  </>
                )}
                {type === "RETRAIT" && (
                  <>
                    <ArrowUpRight size={14} />
                    Valider le Retrait
                  </>
                )}
                {type === "VIREMENT" && (
                  <>
                    <ArrowRightLeft size={14} />
                    Valider le Virement
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Ledger transactions timeline list */}
        <div className="lg:col-span-2 space-y-4" id="ledger-transactions-timeline">
          <div className="bg-[#161718] border border-[#23252a] rounded-xl overflow-hidden shadow-card">
            {/* Ledger Toolbar */}
            <div className="p-4 bg-black/[0.15] border-b border-[#23252a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-mono text-[#8a8f98] uppercase font-semibold">Grand Livre des Écritures</h3>
                <p className="text-[10px] text-[#62666d]">Enregistrements comptables immuables</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search size={12} className="absolute left-2.5 top-2 text-[#62666d]" />
                <input
                  type="text"
                  placeholder="Rechercher par Réf, RIB, Titulaire..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="tx-ledger-search-input"
                  className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-[11px] pl-8 pr-3 py-1 rounded-[4px] outline-none border border-transparent focus:border-[#5e6ad2]/50 transition-all font-mono"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#23252a] bg-black/[0.05]">
                    <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Date & Heure</th>
                    <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Référence</th>
                    <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Type</th>
                    <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Bénéficiaire (Des)</th>
                    <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Provenance (Src)</th>
                    <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((tx) => {
                    const desAccount = accounts.find(a => a.id === tx.accountBankingDes.id);
                    const srcAccount = tx.accountBankingSrc?.id ? accounts.find(a => a?.id === tx.accountBankingSrc?.id) : null;
                    const currency = desAccount?.currency || "MAD";

                    return (
                      <tr key={tx.id} className="border-b border-[#23252a] last:border-0 hover:bg-white/[0.01] transition-colors" id={`tx-row-${tx.id}`}>
                        <td className="p-3 text-xs text-[#8a8f98] font-mono">
                          {new Date(tx.dateOperation).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                          })}
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-xs text-[#f7f8f8] font-semibold">{tx.reference}</span>
                          <span className="block text-[8px] text-[#62666d] font-mono uppercase tracking-wider">JPA Entity</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono font-bold ${
                              tx.type === "DEPOT"
                                ? "bg-[#27a644]/10 text-[#27a644]"
                                : tx.type === "RETRAIT"
                                ? "bg-[#eb5757]/10 text-[#eb5757]"
                                : "bg-[#02b8cc]/10 text-[#02b8cc]"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3 text-xs">
                          <div className="flex flex-col">
                            <span className="text-[#f7f8f8]">{getClientNameByAccountId(tx.accountBankingDes.id)}</span>
                            <span className="font-mono text-[10px] text-[#8a8f98]">{getAccountRIB(tx.accountBankingDes.id)}</span>
                          </div>
                        </td>
                        <td className="p-3 text-xs text-[#8a8f98]">
                          {srcAccount ? (
                            <div className="flex flex-col">
                              <span className="text-[#f7f8f8]">{getClientNameByAccountId(tx.accountBankingSrc.id)}</span>
                              <span className="font-mono text-[10px] text-[#8a8f98]">{srcAccount.RIB}</span>
                            </div>
                          ) : (
                            <span className="text-[#62666d] font-mono text-center">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex flex-col items-end">
                            <span
                              className={`font-mono text-xs font-semibold ${
                                tx.type === "DEPOT"
                                  ? "text-[#27a644]"
                                  : "text-[#eb5757]"
                              }`}
                            >
                              {tx.type === "DEPOT" ? "+" : "-"}
                              {tx.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                            </span>
                            <span className="text-[8px] font-mono font-semibold text-[#27a644]/80 uppercase tracking-widest bg-[#27a644]/5 border border-[#27a644]/10 rounded px-1 mt-0.5">
                              OK
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {sortedTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-xs text-[#62666d] italic">
                        Aucune transaction ne figure dans le livre comptable avec ces filtres.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
