import { LayoutDashboard, Users, Wallet, CreditCard, ArrowLeftRight, Terminal } from "lucide-react";
import {getAllClients } from "../api/clientApi";
import { useEffect, useState } from "react";


interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  clientsCount: number;
  accountsCount: number;
  cardsCount: number;
  transactionsCount: number;
}

export default function Sidebar({
  currentTab,
  setTab,
  clientsCount,
  accountsCount,
  cardsCount,
  transactionsCount,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard, count: null },
    { id: "clients", label: "Gestion Clients", icon: Users, count: clientsCount },
    { id: "accounts", label: "Comptes Bancaires", icon: Wallet, count: accountsCount },
    { id: "cards", label: "Cartes Bancaires", icon: CreditCard, count: cardsCount },
    { id: "transactions", label: "Transactions & Transferts", icon: ArrowLeftRight, count: transactionsCount },

  ];
  

  return (
    <aside className="w-64 bg-[#0f1011] border-r border-[#23252a] flex flex-col justify-between h-full select-none" id="sidebar-container">
      <div>
        {/* Brand / Title Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#23252a]" id="sidebar-header">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[6px] bg-[#5e6ad2]/15 border border-[#5e6ad2]/30 flex items-center justify-center text-[#5e6ad2]">
              <Terminal size={14} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-[510] tracking-tight text-[#f7f8f8]">Vanguard Bank</h1>
              <p className="text-[10px] font-mono text-[#8a8f98] tracking-wider uppercase">Console Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-1.5" id="sidebar-nav-list">
          <p className="px-3 text-[10px] font-mono font-medium text-[#62666d] tracking-wider uppercase mb-2">Modules principaux</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] transition-all duration-150 text-left group ${
                  isActive
                    ? "bg-[#5e6ad2]/15 text-[#f7f8f8] font-[510]"
                    : "text-[#8a8f98] hover:bg-white/[0.03] hover:text-[#f7f8f8]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className={`transition-colors ${
                      isActive ? "text-[#5e6ad2]" : "text-[#8a8f98] group-hover:text-[#f7f8f8]"
                    }`}
                  />
                  <span className="text-xs">{item.label}</span>
                </div>
                {item.count !== null && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded-[4px] transition-colors ${
                      isActive
                        ? "bg-[#5e6ad2]/25 text-[#f7f8f8] border border-[#5e6ad2]/20"
                        : "bg-white/[0.04] text-[#62666d] group-hover:text-[#8a8f98] group-hover:bg-white/[0.06]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#23252a] bg-black/[0.05]" id="sidebar-footer">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-[#8a8f98]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
              Spring MVP Client
            </span>
            <span className="font-mono text-[10px] text-[#62666d]">v1.0.0</span>
          </div>
          <div className="text-[10px] text-[#62666d] leading-relaxed">
            Frontend autonome prêt pour liaison d'API REST Spring Boot.
          </div>
        </div>
      </div>
    </aside>
  );
}
