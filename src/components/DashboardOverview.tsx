import { Client, AccountBanking, CardBanking, Transaction } from "../types";
import { Users, Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, DollarSign } from "lucide-react";

interface DashboardOverviewProps {
  clients: Client[];
  accounts: AccountBanking[];
  cards: CardBanking[];
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
  onQuickDeposit: (accountId: number, amount: number) => void;
}

export default function DashboardOverview({
  clients,
  accounts,
  cards,
  transactions,
  onNavigate,
  onQuickDeposit,
}: DashboardOverviewProps) {
  // Aggregate Stats
  const activeClients = clients.filter(c => c.isActive).length;
  const activeAccounts = accounts.filter(a => a.isActive).length;
  const activeCards = cards.filter(c => c.isActive).length;

  // Calculate totals by currency

  const balanceByCurrency = accounts.reduce((acc , currAcc)=>{
    if(currAcc.isActive){
      acc[currAcc.currency] = (acc[currAcc.currency] || 0) + currAcc.sold;
    }
    return acc;
  } , {} as Record<string  ,number>);


  


  // Get recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime())
    .slice(0, 7);

  const getAccountRIB = (id: number) => {
    const acc = accounts.find(a => a.id === id);
    return acc ? acc.RIB : `ACC-${id}`;
  };

  const getClientNameByAccountId = (id: number) => {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return "Inconnu";
    const client = clients.find(c => c.id === acc.client.id);
    return client ? client.name : "Inconnu";
  };

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-overview-page">
      {/* Page Title & Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="dashboard-header-block">
        <div>
          <h2 className="text-xl font-medium text-[#f7f8f8] tracking-tight">Tableau de Bord Administratif</h2>
          <p className="text-xs text-[#8a8f98] mt-0.5">Statistiques consolidées et raccourcis de simulation de transactions</p>
        </div>
        <button
          onClick={() => onNavigate("transactions")}
          id="btn-nav-transact-simulator"
          className="bg-[#e4f222] text-[#08090a] text-xs font-[510] tracking-tight px-3 py-2 rounded-[6px] hover:bg-[#f0ff44] transition-colors duration-150 shadow-card flex items-center gap-1.5"
        >
          <Plus size={14} />
          Faire une Opération
        </button>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metrics-grid">
        {/* Clients Metric */}
        <div className="bg-[#161718] rounded-xl border border-[#23252a] shadow-card p-4 flex items-center justify-between group hover:border-[#323334] transition-all">
          <div className="space-y-1">
            <p className="text-[11px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Clients Actifs</p>
            <p className="text-2xl font-[510] text-[#f7f8f8] tracking-tight">{activeClients} <span className="text-xs text-[#62666d] font-normal">/ {clients.length}</span></p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center text-[#5e6ad2]">
            <Users size={18} />
          </div>
        </div>

        {/* Accounts Metric */}
        <div className="bg-[#161718] rounded-xl border border-[#23252a] shadow-card p-4 flex items-center justify-between group hover:border-[#323334] transition-all">
          <div className="space-y-1">
            <p className="text-[11px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Comptes Ouverts</p>
            <p className="text-2xl font-[510] text-[#f7f8f8] tracking-tight">{activeAccounts} <span className="text-xs text-[#62666d] font-normal">/ {accounts.length}</span></p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#02b8cc]/10 border border-[#02b8cc]/20 flex items-center justify-center text-[#02b8cc]">
            <Wallet size={18} />
          </div>
        </div>

        {/* Cards Metric */}
        <div className="bg-[#161718] rounded-xl border border-[#23252a] shadow-card p-4 flex items-center justify-between group hover:border-[#323334] transition-all">
          <div className="space-y-1">
            <p className="text-[11px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Cartes Actives</p>
            <p className="text-2xl font-[510] text-[#f7f8f8] tracking-tight">{activeCards} <span className="text-xs text-[#62666d] font-normal">/ {cards.length}</span></p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center text-[#5e6ad2]">
            <CreditCard size={18} />
          </div>
        </div>

        {/* Transactions ledger volume Metric */}
        <div className="bg-[#161718] rounded-xl border border-[#23252a] shadow-card p-4 flex items-center justify-between group hover:border-[#323334] transition-all">
          <div className="space-y-1">
            <p className="text-[11px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Opérations Simulées</p>
            <p className="text-2xl font-[510] text-[#f7f8f8] tracking-tight">{transactions.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#e4f222]/10 border border-[#e4f222]/20 flex items-center justify-center text-[#e4f222]">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>

      {/* Funds & Assets Consolidations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-consolidations">
        {/* Currencies balances */}
        <div className="bg-[#161718] rounded-xl border border-[#23252a] p-5 space-y-4" id="dashboard-currencies-card">
          <div>
            <h3 className="text-sm font-[510] text-[#f7f8f8] tracking-tight">Fonds Totaux Consolidés</h3>
            <p className="text-[11px] text-[#8a8f98]">Somme globale des dépôts actifs par devise</p>
          </div>
          <div className="space-y-3.5 pt-2">
            {/* MAD */}
            <div className="flex justify-between items-center pb-3 border-b border-[#23252a] last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
                <span className="text-xs font-mono text-[#8a8f98]">Dirham Marocain (MAD)</span>
              </div>
              <span className="font-mono text-sm font-medium text-[#27a644]">
                {(balanceByCurrency["MAD"] || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
              </span>
            </div>

            {/* EUR */}
            <div className="flex justify-between items-center pb-3 border-b border-[#23252a] last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#02b8cc]" />
                <span className="text-xs font-mono text-[#8a8f98]">Euro (EUR)</span>
              </div>
              <span className="font-mono text-sm font-medium text-[#02b8cc]">
                {(balanceByCurrency["EUR"] || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR
              </span>
            </div>

            {/* USD */}
            <div className="flex justify-between items-center pb-3 border-b border-[#23252a] last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]" />
                <span className="text-xs font-mono text-[#8a8f98]">US Dollar (USD)</span>
              </div>
              <span className="font-mono text-sm font-medium text-[#5e6ad2]">
                {(balanceByCurrency["USD"] || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </span>
            </div>
          </div>
        </div>

        {/* Quick Testing Actions / Training Shortcut */}
        <div className="bg-[#161718] rounded-xl border border-[#23252a] p-5 space-y-4 lg:col-span-2" id="dashboard-quick-actions-card">
          <div>
            <h3 className="text-sm font-[510] text-[#f7f8f8] tracking-tight">Raccourcis de Test & Simulation</h3>
            <p className="text-[11px] text-[#8a8f98]">Simuler des crédits instantanés pour tester la réactivité du solde</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {accounts.slice(0, 4).map((account) => {
              const clientName = clients.find(c => c.id === account.client.id)?.name || "Client";
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-[#23252a] hover:border-[#323334] transition-all"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-[#f7f8f8]">{clientName}</p>
                    <p className="text-[10px] font-mono text-[#8a8f98]">
                      {account.RIB.slice(0, 4)}...{account.RIB.slice(-4)} ({account.type})
                    </p>
                    <p className="text-[11px] font-mono text-[#27a644] font-semibold">
                      {account.sold.toLocaleString("fr-FR")} {account.currency}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => onQuickDeposit(account.id, 1000 , "DEPOT")}
                      id={`btn-quick-dep-1000-${account.id}`}
                      className="bg-[#27a644]/10 hover:bg-[#27a644]/20 text-[#27a644] text-[10px] font-mono px-2 py-1 rounded border border-[#27a644]/20 transition-all"
                    >
                      +1k {account.currency}
                    </button>
                    <button
                      onClick={() => onQuickDeposit(account.id, 1000 , "RETRAIT")}
                      id={`btn-quick-dep-5000-${account.id}`}
                      className="bg-[#27a644]/10 hover:bg-[#27a644]/20 text-[#27a644] text-[10px] font-mono px-2 py-1 rounded border border-[#27a644]/20 transition-all"
                    >
                      -1k {account.currency}
                    </button>
                  </div>
                </div>
              );
            })}
            {accounts.length === 0 && (
              <p className="text-xs text-[#62666d] italic col-span-2 py-4 text-center">Aucun compte ouvert pour la simulation de dépôt</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Ledger Postings */}
      <div className="bg-[#161718] rounded-xl border border-[#23252a] overflow-hidden" id="dashboard-recent-transactions">
        <div className="p-5 border-b border-[#23252a] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-[510] text-[#f7f8f8] tracking-tight">Journal d'Opérations Récent</h3>
            <p className="text-[11px] text-[#8a8f98]">Les 5 dernières écritures financières enregistrées</p>
          </div>
          <button
            onClick={() => onNavigate("transactions")}
            id="btn-nav-all-ledger"
            className="text-xs text-[#5e6ad2] hover:text-[#9b7fff] transition-colors"
          >
            Voir tout l'historique
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#23252a] bg-black/[0.15]">
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Date & Heure</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Référence</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Type</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Bénéficiaire</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Source (Transfert)</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => {
                const desAccount = accounts.find(a => a.id === tx.accountBankingDes.id);
                const srcAccount = tx.accountBankingSrc ? accounts.find(a => a.id === tx.accountBankingSrc?.id) : null;
                const currency = desAccount?.currency || "MAD";

                return (
                  <tr key={tx.id} className="border-b border-[#23252a] last:border-0 hover:bg-white/[0.01] transition-colors">
                    <td className="p-3 text-xs text-[#8a8f98]">
                      {new Date(tx.dateOperation).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3 font-mono text-xs text-[#8a8f98]">{tx.reference}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-[510] ${
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
                        <span className="font-mono text-[10px] text-[#62666d]">{getAccountRIB(tx.accountBankingDes.id)}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-[#8a8f98]">
                      {srcAccount ? (
                        <div className="flex flex-col">
                          <span className="text-[#f7f8f8]">{getClientNameByAccountId(tx.accountBankingSrc.id)}</span>
                          <span className="font-mono text-[10px] text-[#62666d]">{srcAccount.RIB}</span>
                        </div>
                      ) : (
                        <span className="text-[#62666d] font-mono">—</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`font-mono text-xs font-[510] ${
                          tx.type === "DEPOT"
                            ? "text-[#27a644]"
                            : "text-[#eb5757]"
                        }`}
                      >
                        {tx.type === "DEPOT" ? "+" : "-"}
                        {tx.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {currency}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#62666d] italic">
                    Aucune transaction enregistrée. Rendez-vous sur le module de Transactions pour tester.
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
