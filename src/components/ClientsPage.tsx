import React, { useState  } from "react";
import { Client } from "../types";
import { Search, Plus, Edit2, Trash2, X, Users, CreditCard, Wallet, AlertCircle } from "lucide-react";
import { useEffect } from "react";
// import apis
import { createClient ,updateClient , deleteClient , searchClient , getAllClients , getClientById } from "../api/clientApi";
import { response } from "express";


interface ClientsPageProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, "id" | "dateCreation">) => void;
  onUpdateClient: (id: number, client: Client) => void;
 // onViewAccounts: (clientId: number) => void;
  onDeleteClient: (id: number) => void;
}

export default function ClientsPage({
  clients,
  onAddClient,
  onUpdateClient,
 // onViewAccounts,
  onDeleteClient
}: ClientsPageProps) {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form Fields State
  const [CIN, setCIN] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
 
  
  const handleOpenCreate = () => {
    setEditingClient(null);
    setCIN("");
    setName("");
    setEmail("");
    setPhoneNumber("");
    setIsActive(true);
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setCIN(client.CIN);
    setName(client.name);
    setEmail(client.email);
    setPhoneNumber(client.phoneNumber);
    setIsActive(client.isActive);
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!CIN || !name || !email || !phoneNumber) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }
    if (editingClient) {
      onUpdateClient(editingClient.id, {
        id: editingClient.id,
        CIN: CIN.toUpperCase(),
        name,
        email,
        phoneNumber,
        isActive,
      });
    } else {
      // Check duplicate CIN in current list
      if (clients.some((c) => c.CIN.toUpperCase() === CIN.toUpperCase())) {
        setErrorMessage("Un client avec cette CIN existe déjà.");
        return;
      }
      onAddClient({
        CIN: CIN.toUpperCase(),
        name,
        email,
        phoneNumber,
        isActive,
      });
      
    }
    setIsFormOpen(false);
  };

  // Filter clients
  const filteredClients = clients.filter(
    (c)=> c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.CIN.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="space-y-6 animate-fade-in" id="clients-crud-page">
      {/* Page Header */}
      <div className="flex justify-between items-center" id="clients-header-block">
        <div>
          <h2 className="text-xl font-medium text-[#f7f8f8] tracking-tight">Gestion des Clients</h2>
          <p className="text-xs text-[#8a8f98] mt-0.5">Enregistrer, modifier et suivre les profils clients de la banque</p>
        </div>
        <button
          onClick={handleOpenCreate}
          id="btn-create-client"
          className="bg-[#e4f222] text-[#08090a] text-xs font-[510] tracking-tight px-3 py-2 rounded-[6px] hover:bg-[#f0ff44] transition-colors duration-150 shadow-card flex items-center gap-1.5"
        >
        <Plus size={14} />
          Ajouter un Client
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center gap-3 bg-[#161718] p-3 rounded-xl border border-[#23252a]" id="clients-toolbar">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-[#62666d]" />
          <input
            type="text"
            placeholder="Rechercher par Nom, Email ou CIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="clients-search-input"
            className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs pl-9 pr-4 py-2 rounded-[6px] outline-none border border-transparent focus:border-[#5e6ad2]/50 transition-all"
          />
        </div>
        <div className="text-[11px] font-mono text-[#62666d]">
          Total: <span className="text-[#8a8f98] font-semibold">{filteredClients.length}</span>
        </div>
      </div>

      {/* Clients Form Drawer / Modal (Linear style HUD overlay) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="clients-form-modal">
          <div className="bg-[#161718] border border-[#323334] rounded-xl shadow-overlay w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#23252a] bg-black/[0.15]">
              <h3 className="text-sm font-[510] text-[#f7f8f8]">
                {editingClient ? "Modifier les coordonnées" : "Enregistrer un nouveau client"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                id="btn-close-client-form"
                className="text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {errorMessage && (
                <div className="bg-[#eb5757]/10 border border-[#eb5757]/20 rounded-[6px] p-3 flex items-start gap-2 text-xs text-[#eb5757]">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* CIN Field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">CIN (Ex: JM123456)</label>
                <input
                  type="text"
                  placeholder="JM123456"
                  value={CIN}
                  onChange={(e) => setCIN(e.target.value)}
                  id="form-client-cin"
                  disabled={!!editingClient}
                  className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs px-3 py-2 rounded-[6px] outline-none focus:shadow-focus transition-all uppercase disabled:opacity-50"
                  required
                />
              </div>

              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Nom Complet</label>
                <input
                  type="text"
                  placeholder="Oualid Elamrouchi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="form-client-name"
                  className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs px-3 py-2 rounded-[6px] outline-none focus:shadow-focus transition-all"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Adresse Email</label>
                <input
                  type="email"
                  placeholder="oualid@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="form-client-email"
                  className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs px-3 py-2 rounded-[6px] outline-none focus:shadow-focus transition-all"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-medium text-[#8a8f98] uppercase">Numéro de Téléphone</label>
                <input
                  type="text"
                  placeholder="+212 600 000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  id="form-client-phone"
                  className="w-full bg-[#383b3f] text-[#f7f8f8] placeholder-[#62666d] text-xs px-3 py-2 rounded-[6px] outline-none focus:shadow-focus transition-all"
                  required
                />
              </div>

              {/* Status Toggle Switch */}
              <div className="flex items-center justify-between py-2 border-t border-[#23252a]">
                <div>
                  <span className="block text-xs font-medium text-[#f7f8f8]">Statut d'Activité</span>
                  <span className="block text-[10px] text-[#8a8f98]">Autoriser l'accès aux opérations bancaires</span>
                </div>
                <button
                  type="button"
                  id="form-client-status-toggle"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-150 outline-none ${
                    isActive ? "bg-[#27a644]" : "bg-[#62666d]"
                  }`}
                >
                  <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-150 ${
                    isActive ? "translate-x-4.5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#23252a]">
                <button
                  type="button"
                  id="form-client-btn-cancel"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-transparent text-[#8a8f98] text-xs font-medium px-3.5 py-1.5 rounded-[6px] hover:text-[#f7f8f8] hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  id="form-client-btn-submit"
                  className="bg-[#e4f222] text-[#08090a] text-xs font-[510] px-4 py-1.5 rounded-[6px] hover:bg-[#f0ff44] transition-all shadow-card"
                >
                  {editingClient ? "Enregistrer" : "Créer le client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clients Data Grid */}
      <div className="bg-[#161718] rounded-xl border border-[#23252a] overflow-hidden" id="clients-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#23252a] bg-black/[0.15]">
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">CIN</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Nom complet</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Adresse Email</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Téléphone</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Création</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase">Statut</th>
                <th className="p-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-[#23252a] last:border-0 hover:bg-white/[0.01] transition-colors" id={`client-row-${client.id}`}>
                  <td className="p-3 font-mono text-xs font-semibold text-[#8a8f98]">{client.CIN}</td>
                  <td className="p-3 text-xs">
                    <span className="text-[#f7f8f8] font-medium block">{client.name}</span>
                    <span className="text-[10px] text-[#62666d] font-mono">ID: CLIENT-{client.id}</span>
                  </td>
                  <td className="p-3 text-xs text-[#8a8f98]">{client.email}</td>
                  <td className="p-3 text-xs text-[#8a8f98] font-mono">{client.phoneNumber}</td>
                  <td className="p-3 text-xs text-[#62666d]">
                    {client.dateCreate ? `${client.dateCreate.slice(0, 10)}` : "MM/YY/DD"}
                  </td>
                  <td className="p-3">
                    {client.isActive ? (
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
                      {/* View Accounts Shortcut */}
                      <button
                        //onClick={() => onViewAccounts(client.id)}
                        id={`btn-view-acc-shortcut-${client.id}`}
                        className="p-1.5 text-[#8a8f98] hover:text-[#5e6ad2] hover:bg-[#5e6ad2]/10 rounded-[4px] transition-all"
                        title="Consulter les comptes bancaires"
                      >
                        <Wallet size={14} />
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => handleOpenEdit(client)}
                        id={`btn-edit-client-${client.id}`}
                        className="p-1.5 text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/5 rounded-[4px] transition-all"
                        title="Modifier le profil"
                      >
                        <Edit2 size={14} />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={()=> onDeleteClient(client.id)}
                        id={`btn-delete-client-${client.id}`}
                        className="p-1.5 text-[#eb5757]/70 hover:text-[#eb5757] hover:bg-[#eb5757]/10 rounded-[4px] transition-all"
                        title="Supprimer définitivement"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#62666d] italic">
                    Aucun client ne correspond à votre recherche.
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

