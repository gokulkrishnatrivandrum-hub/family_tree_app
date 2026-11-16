"use client";

import React from "react";
import { NavTab } from "./Sidebar";
import { Home, GitFork, Users, MessageSquare, User } from "lucide-react";

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingRequestsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  pendingRequestsCount,
}) => {
  const items: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "tree", label: "Tree", icon: <GitFork className="w-5 h-5" /> },
    { id: "feed", label: "Feed", icon: <Home className="w-5 h-5" /> },
    { 
      id: "discover", 
      label: "Discover", 
      icon: <Users className="w-5 h-5" />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    { id: "messages", label: "Chat", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-line-border px-2 py-2 flex items-center justify-around shadow-2xl">
      {items.map(item => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition ${
              isActive ? "text-primary font-bold" : "text-font-muted hover:text-font-main"
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
