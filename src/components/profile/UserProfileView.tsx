"use client";

import React, { useState } from "react";
import { PersonProfile, Post } from "@/types/family";
import { PostCard } from "@/components/feed/PostCard";
import { ShieldCheck, MapPin, Calendar, Briefcase, Download, LogOut } from "lucide-react";

interface UserProfileViewProps {
  currentUser: PersonProfile;
  userPosts: Post[];
  onLogout?: () => void;
  lang?: string;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  userPosts,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<"posts" | "info">("posts");
  const name = currentUser.displayName;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-line-border overflow-hidden shadow-card">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-primary via-indigo-600 to-secondary relative">
          {currentUser.coverUrl && (
            <img src={currentUser.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-90" />
          )}
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white shadow-node bg-white flex-shrink-0">
              <img src={currentUser.avatarUrl} alt={name} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Exporting personal family archive...")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-line-border bg-surface-muted text-font-main hover:bg-line-border/30 text-xs font-bold transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Family Data</span>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-danger hover:bg-red-100 text-xs font-bold transition shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-font-main">{name}</h2>
              <span className="flex items-center gap-1 bg-secondary/10 text-secondary text-xs font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Relative</span>
              </span>
            </div>

            <p className="text-xs text-font-muted mt-1 max-w-xl leading-relaxed">
              {currentUser.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-font-muted">
              {currentUser.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {currentUser.location}
                </span>
              )}
              {currentUser.profession && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-accent" />
                  {currentUser.profession}
                </span>
              )}
              {currentUser.dateOfBirth && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  {currentUser.dateOfBirth}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-line-border">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "posts" ? "bg-primary text-white shadow-soft" : "text-font-muted hover:bg-surface-muted"
              }`}
            >
              My Family Posts
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "info" ? "bg-primary text-white shadow-soft" : "text-font-muted hover:bg-surface-muted"
              }`}
            >
              Privacy & Discovery Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} currentUser={currentUser} />
          ))}
          {userPosts.length === 0 && (
            <div className="bg-white rounded-3xl p-8 text-center text-xs text-font-muted">
              No family posts published yet.
            </div>
          )}
        </div>
      )}

      {activeTab === "info" && (
        <div className="bg-white rounded-3xl p-6 border border-line-border shadow-card space-y-4 text-xs">
          <h3 className="font-bold text-base text-font-main">
            Privacy & Identity Verification
          </h3>
          <p className="text-font-muted leading-relaxed">
            Your family profile and lineage tree are private by default. Only verified relatives connected through approved relationship requests can view milestones, photos, and personal memories.
          </p>
        </div>
      )}
    </div>
  );
};
