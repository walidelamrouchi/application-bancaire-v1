import React, { useState } from "react";
import { Client, AccountBanking, CardBanking, CardBankingRequest } from "../types";
import { Search, Plus, Edit2, Trash2, X, AlertCircle, CreditCard, Key } from "lucide-react";

interface CardsPageProps {
  cards: CardBanking[];
  accounts: AccountBanking[];
  clients: Client[];
  accountIdFilter: number | null;
  onClearFilter: () => void;
  onAddCard: (card: CardBankingRequest) => void;
  onUpdateCard: (id: number, card: CardBankingRequest) => void;
  onDeleteCard: (id: number) => void;
}

export default function CardsPage({
  cards,
  accounts,
  clients,
  accountIdFilter,
  onClearFilter,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}: CardsPageProps) {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardBanking | null>(null);

  // Form Fields State
  const [accountId, setAccountId] = useState<number>(0);
  const [PAN, setPAN] = useState("");
  const [dateExp, setDateExp] = useState("");
  const [ceilingDay, setCeilingDay] = useState<number>(5000);
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const generateRandomPAN = () => {
    let pan = "4532"; // Visa identifier
    for (let i = 0; i < 12; i++) {
      pan += Math.floor(Math.random() * 10).toString();
    }
    return pan;
  };

  const handleOpenCreate = () => {
    setEditingCard(null);
    setAccountId(accounts[0].id || 0);
    setPAN(generateRandomPAN());
    // Auto set expiration date to 4 years in the future (YYYY-MM-DD)
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 4);
    setDateExp(futureDate.toISOString().split("T")[0]);
    setCeilingDay(10000);
    setIsActive(true);
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (card: CardBanking) => {
    setEditingCard(card);
    setAccountId(card.accountBanking?.id);
    setPAN(card.PAN);
    setDateExp(card.dateExp);
    setCeilingDay(card.ceilingDay);
    setIsActive(card.isActive);
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountId) {
      setErrorMessage("Veuillez sélectionner un compte bancaire lié.");
      return;
    }

    if (!PAN || PAN.length !== 16) {
      setErrorMessage("Le numéro de carte (PAN) doit contenir exactement 16 chiffres.");
      return;
    }

    if (!dateExp) {
      setErrorMessage("Veuillez spécifier la date d'expiration.");
      return;
    }

    if (ceilingDay < 0) {
      setErrorMessage("Le plafond journalier doit être supérieur ou égal à 0.");
      return;
    }

    if (editingCard) {
      onUpdateCard( editingCard.id, {
        accountBanking: { id: accountId },
        PAN,
        dateExp,
        ceilingDay,
        isActive,
      });
    } else {
      // Check PAN duplicate
      if (cards.some(c => c.PAN === PAN)) {
        setErrorMessage("Cette carte bancaire (PAN) est déjà enregistrée.");
        return;
      }
      onAddCard({
        accountBanking: { id: accountId },
        PAN,
        dateExp,
        ceilingDay,
        isActive,
      });
    }

    setIsFormOpen(false);
  };
  //test

 

  const getAccountRIB = (id: number) => {
      const acc = accounts?.find(a => a.id === id);
      return acc ? acc.RIB : "RIB inconnu";
  };

  const getCardOwnerName = (card: CardBanking) => {
    try{
      const acc = accounts?.find(a => a.id === card.accountBanking.id);
      if (!acc) return "Inconnu";
      const client = clients?.find(c => c.id === acc.client.id);
      return client ? client.name : "Inconnu";
    }
    catch(e){
      console.error("mal9inach had Card aslan asahbi:", e);
      return "Inconnu";
    }
  };

  // Filter and search
  const filteredCards = cards.filter((card) => {
    // 1. Account Filter
    if (accountIdFilter !== null && card.accountBanking?.id !== accountIdFilter) {
      return false;
    }
    // 2. Search query matches PAN or linked RIB
    const rib = getAccountRIB(card.accountBanking?.id);
    const owner = getCardOwnerName(card).toLowerCase();
    const matchesSearch =
      card.PAN.includes(search) ||
      rib.includes(search) || 
      owner.includes(search.toLowerCase());
    return matchesSearch;
  });

  const activeFilterRIB = accountIdFilter !== null ? getAccountRIB(accountIdFilter) : "";

  // Helper to chunk PAN for visual display (e.g. 4532 8920 1283 9102)
  const formatPAN = (num: string) => {
    return num.replace(/(\d{4})/g, "$1 ").trim();
  };
  

  return (
    <div className="space-y-6 animate-fade-in" id="cards-crud-page">
      {/* Page Header */}
      <div className="flex justify-between items-center" id="cards-header-block">
        <div>
          <h2 className="text-xl font-medium text-[#f7f8f8] tracking-tight">Cartes Bancaires (PAN)</h2>
          <p className="text-xs text-[#8a8f98] mt-0.5">Configurer et octroyer des cartes de crédit physiques/virtuelles rattachées aux comptes</p>
        </div>
        <button
          onClick={handleOpenCreate}
          id="btn-create-card"
          className="bg-[#e4f222] text-[#08090a] text-xs font-[510] tracking-tight px-3 py-2 rounded-[6px] hover:bg-[#f0ff44] transition-colors duration-150 shadow-card flex items-center gap-1.5"
        >
          <Plus size={14} />
          Commander une Carte
        </button>
      </div>

      {/* Filter banner if active */}
      {/* {accountIdFilter !== null && (
        <div className="bg-[#5e6ad2]/10 border border-[#5e6ad2]/25 rounded-xl p-4 flex items-center justify-between" id="cards-filter-banner">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5e6ad2]/15 flex items-center justify-center text-[#5e6ad2]">
              <CreditCard size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#f7f8f8]">Filtre par Compte Actif</p>
              <p className="text-[11px] text-[#8a8f98]">Affichage des cartes associées au RIB: <span className="text-[#f7f8f8] font-mono">{activeFilterRIB}</span></p>
            </div>
          </div>
          <button
            onClick={onClearFilter}
            id="btn-clear-cards-filter"
            className="text-xs bg-[#383b3f] hover:bg-white/5 text-[#f7f8f8] border border-[#23252a] px-3 py-1.5 rounded-[6px] transition-all"
          >
            Effacer le filtre
          </button>
        </div>
      )} */}

      {/* Search Toolbar */}
      <div className="flex items-center gap-3 bg-[#161718] p-3 rounded-xl border border-[#23252a]" id="cards-toolbar">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-[#62666d]" />
          <input
            type="text"
            placeholder="Rechercher par numéro de carte (PAN), titulaire, RIB lié..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="cards-search-input"
            className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs pl-9 pr-4 py-2 rounded-[6px] outline-none border border-transparent focus:border-[#5e6ad2]/50 transition-all"
          />
        </div>
        <div className="text-[11px] font-mono text-[#62666d]">
          Cartes: <span className="text-[#8a8f98] font-semibold">{filteredCards.length}</span>
        </div>
      </div>

      {/* Create / Edit Card Modal HUD */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="cards-form-modal">
          <div className="bg-[#161718] border border-[#323334] rounded-xl shadow-overlay w-full max-w-lg overflow-hidden flex flex-col md:flex-row">
            {/* Left Column: Glassmorphic Credit Card Preview */}
            <div className="bg-[#0f1011] p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-[#23252a] md:w-56">
              <div className="relative w-48 h-30 bg-gradient-to-br from-[#1c2850] to-[#08090a] rounded-xl border border-[#3c4b7e] p-4 flex flex-col justify-between shadow-lg select-none overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[#5e6ad2]/10 blur-xl"></div>
                <div className="flex justify-between items-start">
                  <div className="text-[10px] font-mono text-[#8a8f98] tracking-widest uppercase">COMMAND DECK</div>
                  <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Key size={10} className="text-amber-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-white/90 tracking-widest text-center">
                    {PAN ? formatPAN(PAN) : "4532 •••• •••• ••••"}
                  </p>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-[7px] text-[#62666d] uppercase">CARD OWNER</p>
                    <p className="text-[9px] font-mono text-[#f7f8f8] truncate max-w-[80px]">
                      TITULAIRE
                      {/* {accountId ? getCardOwnerName({ accountId } as CardBanking) : "TITULAIRE"} */}
                    </p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[7px] text-[#62666d] uppercase">EXPIRES</p>
                    <p className="text-[9px] font-mono text-[#f7f8f8]">
                      {dateExp ? `${dateExp.slice(5, 7)}/${dateExp.slice(2, 4)}` : "MM/YY"}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-[#62666d] mt-4 font-mono text-center">Aperçu interactif de la puce</p>
            </div>

            {/* Right Column: Form fields */}
            <div className="flex-1 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#23252a] pb-3">
                <h3 className="text-xs font-[510] text-[#f7f8f8] uppercase tracking-wider">Configuration de la Carte</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  id="btn-close-card-form"
                  className="text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="bg-[#eb5757]/10 border border-[#eb5757]/20 rounded-[6px] p-2.5 flex items-start gap-1.5 text-xs text-[#eb5757]">
                    <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                    <span className="text-[11px]">{errorMessage}</span>
                  </div>
                )}

                {/* Account Link */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Compte bancaire rattaché</label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(Number(e.target.value))}
                    id="form-card-account"
                    disabled={!!editingCard}
                    className="w-full bg-[#383b3f] text-[#f7f8f8] text-xs px-2.5 py-1.5 rounded-[6px] outline-none focus:shadow-focus transition-all disabled:opacity-50"
                    required
                  >
                    <option value={0}>-- Sélectionner un RIB actif --</option>
                    {accounts.map((acc) => {
                      const owner = clients.find(c => c.id === acc.client?.id)?.name || "Inconnu";
                      return (
                        <option key={acc.id} value={acc.id} disabled={!acc.isActive}>
                          {owner} — {acc.RIB.slice(0, 4)}...{acc.RIB.slice(-4)} {acc.isActive ? "" : "(Bloqué)"}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* PAN Number */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Numéro PAN (16 chiffres)</label>
                    {!editingCard && (
                      <button
                        type="button"
                        id="btn-regen-pan"
                        onClick={() => setPAN(generateRandomPAN())}
                        className="text-[10px] text-[#5e6ad2] hover:underline"
                      >
                        Générer PAN
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="PAN à 16 chiffres"
                    value={PAN}
                    onChange={(e) => setPAN(e.target.value.replace(/\D/g, "").slice(0, 16))}
                    maxLength={16}
                    id="form-card-pan"
                    disabled={!!editingCard}
                    className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs px-2.5 py-1.5 rounded-[6px] outline-none focus:shadow-focus transition-all font-mono tracking-wider disabled:opacity-50"
                    required
                  />
                </div>

                {/* Expiration and Ceiling Limit */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Expiration (AAAA-MM-JJ)</label>
                    <input
                      type="date"
                      value={dateExp}
                      onChange={(e) => setDateExp(e.target.value)}
                      id="form-card-date-exp"
                      className="w-full bg-[#383b3f] text-[#f7f8f8] text-xs px-2.5 py-1.5 rounded-[6px] outline-none focus:shadow-focus transition-all font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Plafond jour (MAD/EUR)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={ceilingDay}
                      onChange={(e) => setCeilingDay(Math.max(0, Number(e.target.value)))}
                      id="form-card-ceiling"
                      className="w-full bg-[#383b3f] text-[#f7f8f8] text-xs px-2.5 py-1.5 rounded-[6px] outline-none focus:shadow-focus transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Card Status Switch */}
                <div className="flex items-center justify-between py-2 border-t border-[#23252a]">
                  <div>
                    <span className="block text-[11px] font-medium text-[#f7f8f8]">Activer la carte</span>
                    <span className="block text-[9px] text-[#8a8f98]">Autoriser les paiements physiques & en ligne</span>
                  </div>
                  <button
                    type="button"
                    id="form-card-status-toggle"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 outline-none ${
                      isActive ? "bg-[#27a644]" : "bg-[#62666d]"
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-150 ${
                      isActive ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#23252a]">
                  <button
                    type="button"
                    id="form-card-btn-cancel"
                    onClick={() => setIsFormOpen(false)}
                    className="bg-transparent text-[#8a8f98] text-xs px-3 py-1.5 rounded-[6px] hover:text-[#f7f8f8] hover:bg-white/5 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    id="form-card-btn-submit"
                    className="bg-[#e4f222] text-[#08090a] text-xs font-[510] px-3.5 py-1.5 rounded-[6px] hover:bg-[#f0ff44] transition-all shadow-card"
                  >
                    {editingCard ? "Enregistrer" : "Créer la carte"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cards Table List */}
      <div className="bg-[#161718] rounded-xl border border-[#23252a] overflow-hidden" id="cards-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#23252a] bg-black/[0.15]">
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Numéro PAN (Visa)</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Titulaire</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Compte lié (RIB)</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Date d'expiration</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Plafond jour</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Statut</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => {
                const rib = getAccountRIB(card.accountBanking?.id);
                const ownerName = getCardOwnerName(card);
                const isCardExpired = new Date(card.dateExp) < new Date();

                return (
                  <tr key={card.id} className="border-b border-[#23252a] last:border-0 hover:bg-white/[0.01] transition-colors" id={`card-row-${card.id}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-4.5 rounded-[3px] bg-[#1c2850] border border-[#3c4b7e] flex items-center justify-center text-[7px] font-bold text-[#8a8f98] font-mono">
                          VISA
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#8a8f98] tracking-wider">
                          {formatPAN(card.PAN)}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#62666d] font-mono block pl-8">ID: CARD-{card.id}</span>
                    </td>
                    <td className="p-3 text-xs font-medium text-[#f7f8f8]">{ownerName}</td>
                    <td className="p-3">
                      <span className="font-mono text-xs text-[#8a8f98] block">{rib}</span>
                      <span className="text-[10px] text-[#62666d] font-mono">ACCOUNT-{card.accountBanking?.id}</span>
                    </td>
                    <td className="p-3 text-xs">
                      <span className={`font-mono ${isCardExpired ? "text-[#eb5757] font-semibold" : "text-[#8a8f98]"}`}>
                        {new Date(card.dateExp).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
                      </span>
                      {isCardExpired && (
                        <span className="block text-[9px] text-[#eb5757] font-semibold uppercase tracking-wider">Expirée</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-xs font-medium text-[#f7f8f8]">
                        {card.ceilingDay.toLocaleString("fr-FR")} MAD
                      </span>
                    </td>
                    <td className="p-3">
                      {card.isActive && !isCardExpired ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10px] font-[510] text-[#27a644] bg-[#27a644]/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10px] font-[510] text-[#eb5757] bg-[#eb5757]/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#eb5757]" />
                          {isCardExpired ? "Expirée" : "Bloquée"}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit card ceiling / status */}
                        <button
                          onClick={() => handleOpenEdit(card)}
                          id={`btn-edit-card-${card.id}`}
                          className="p-1.5 text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/5 rounded-[4px] transition-all"
                          title="Modifier le plafond ou statut"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Delete card */}
                        <button
                          onClick={() => onDeleteCard(card.id)}
                          id={`btn-delete-card-${card.id}`}
                          className="p-1.5 text-[#eb5757]/70 hover:text-[#eb5757] hover:bg-[#eb5757]/10 rounded-[4px] transition-all"
                          title="Supprimer la carte"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCards.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#62666d] italic">
                    Aucune carte bancaire ne correspond aux filtres actuels.
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
