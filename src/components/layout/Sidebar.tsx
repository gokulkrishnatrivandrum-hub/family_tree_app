"use client";

import React from "react";
import { 
  Home, 
  GitFork, 
  Users, 
  MessageSquare, 
  Bookmark, 
  User, 
  ShieldCheck 
} from "lucide-react";

export type NavTab = "tree" | "feed" | "discover" | "messages" | "memories" | "profile";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingRequestsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingRequestsCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "tree", label: "Family Tree", icon: <GitFork className="w-5 h-5 text-primary" /> },
    { id: "feed", label: "Family Feed", icon: <Home className="w-5 h-5 text-secondary" /> },
    { 
      id: "discover", 
      label: "Discover Kin", 
      icon: <Users className="w-5 h-5 text-accent" />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined
    },
    { id: "messages", label: "Messages", icon: <MessageSquare className="w-5 h-5 text-indigo-500" /> },
    { id: "memories", label: "Memories Vault", icon: <Bookmark className="w-5 h-5 text-rose-500" /> },
    { id: "profile", label: "My Profile", icon: <User className="w-5 h-5 text-emerald-600" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-line-border p-4 h-[calc(100vh-61px)] sticky top-[61px]">
      <div className="space-y-1.5 flex-1">
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-soft"
                  : "text-font-main hover:bg-surface-muted hover:text-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-white" : ""}>{item.icon}</span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? "bg-white text-primary" : "bg-danger text-white animate-pulse"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Verified Family Badge Widget at bottom */}
      <div className="p-4 bg-surface-muted rounded-2xl border border-line-border/60 text-xs text-font-muted space-y-2">
        <div className="flex items-center gap-2 text-font-main font-bold">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>Verified Family Space</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Protected with end-to-end relationship privacy and Google Identity.
        </p>
      </div>
    </aside>
  );
};
