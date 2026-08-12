import { RefreshCw, Database, Clock, User } from "lucide-react";

interface HeaderProps {
  userEmail: string;
  onResetData: () => void;
  statusText?: string;
}

export default function Header({ userEmail, onResetData, statusText = "MOTEUR LOCAL ACTIF" }: HeaderProps) {
  return (
    <header className="h-14 bg-[#0f1011] border-b border-[#23252a] px-6 flex items-center justify-between" id="header-container">
      {/* Left side: System status */}
      <div className="flex items-center gap-4" id="header-status-area">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27a644] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27a644]"></span>
          </span>
          <span className="text-[11px] font-mono font-medium tracking-wider text-[#8a8f98] uppercase">
            {statusText}
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 border-l border-[#23252a] pl-4 text-xs text-[#62666d]" id="header-endpoints-tip">
          <Database size={13} />
          <span className="font-mono">API Target: <span className="text-[#8a8f98]">http://localhost:8080/api/v1</span></span>
        </div>
      </div>

      {/* Right side: User, UTC Clock, Actions */}
      <div className="flex items-center gap-4" id="header-actions-area">
        {/* User Session */}
        <div className="flex items-center gap-2 text-xs border-r border-[#23252a] pr-4 py-1" id="header-user-profile">
          <User size={14} className="text-[#5e6ad2]" />
          <span className="text-[#8a8f98] font-mono">{userEmail}</span>
        </div>

        {/* Real-time indicator clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#62666d] border-r border-[#23252a] pr-4 py-1" id="header-clock">
          <Clock size={13} />
          <span className="font-mono">2026-07-01 15:10 UTC</span>
        </div>

        {/* Reset Database Button */}
        <button
          onClick={onResetData}
          id="btn-reset-database"
          className="flex items-center gap-1.5 bg-transparent text-[#eb5757] hover:bg-[#eb5757]/10 px-2.5 py-1.5 rounded-[6px] border border-[#eb5757]/20 transition-all duration-150 text-xs"
          title="Réinitialiser les données de démonstration locales"
        >
          <RefreshCw size={12} />
          <span className="hidden sm:inline font-mono uppercase tracking-wider">Reset DB</span>
        </button>
      </div>
    </header>
  );
}
