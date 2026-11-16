"use client";

import React, { useState } from "react";
import { PersonProfile } from "@/types/family";
import { Bell, LogIn, LogOut, User, Users } from "lucide-react";

interface TopNavbarProps {
  currentUser: PersonProfile;
  totalMembersCount: number;
  isLoggedIn: boolean;
  pendingRequestsCount: number;
  onOpenRequests: () => void;
  onOpenProfile: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentUser,
  totalMembersCount,
  isLoggedIn,
  pendingRequestsCount,
  onOpenRequests,
  onOpenProfile,
  onLogin,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-line-border px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-secondary flex items-center justify-center text-white shadow-soft font-bold text-lg select-none">
            🌳
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-lg text-font-main tracking-tight leading-none">
              Kinship
            </h1>
            <p className="text-[10.5px] text-font-muted font-medium mt-0.5 hidden sm:block">
              Modern Family Tree Social Network
            </p>
          </div>
        </div>

        {/* Center: Total Members Counter Badge (Requirement 7) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-muted border border-line-border text-xs font-semibold text-font-main shadow-sm">
          <Users className="w-4 h-4 text-primary" />
          <span>{totalMembersCount} Family Members</span>
        </div>

        {/* Right Tools (Notifications, Auth/Profile) */}
        <div className="flex items-center gap-2.5">
          {isLoggedIn ? (
            <>
              {/* Pending Connection Requests Notification Bell */}
              <button
                onClick={onOpenRequests}
                className="relative p-2 rounded-xl border border-line-border hover:bg-surface-muted transition text-font-muted hover:text-font-main"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {pendingRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              {/* User Profile Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl hover:bg-surface-muted border border-transparent hover:border-line-border transition"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-primary shadow-sm flex-shrink-0">
                    <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-font-main hidden md:inline truncate max-w-[120px]">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[10px] text-font-muted">▼</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-line-border p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                    <div className="p-2 border-b border-line-border">
                      <p className="text-xs font-bold text-font-main">
                        {currentUser.displayName}
                      </p>
                      <p className="text-[10.5px] text-font-muted truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-font-main hover:bg-surface-muted transition"
                    >
                      <User className="w-4 h-4 text-primary" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-danger hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-soft transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
