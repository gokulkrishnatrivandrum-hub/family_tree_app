"use client";

import React, { useState } from "react";
import { PersonProfile, BranchCategory, RelationshipType } from "@/types/family";
import { Search, UserPlus, Sparkles, Copy, Check, UserCheck, X } from "lucide-react";

interface DiscoverContainerProps {
  currentUser: PersonProfile;
  connectedMembers: PersonProfile[];
  unconnectedRelatives: PersonProfile[];
  onConnectRequest: (member: PersonProfile, relationType: RelationshipType, customNote?: string) => void;
}

export const DiscoverContainer: React.FC<DiscoverContainerProps> = ({
  currentUser,
  connectedMembers,
  unconnectedRelatives,
  onConnectRequest,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"unconnected" | "connected">("unconnected");
  
  // Connection Modal state
  const [connectingPerson, setConnectingPerson] = useState<PersonProfile | null>(null);
  const [selectedRelType, setSelectedRelType] = useState<RelationshipType>("COUSIN");
  const [requestNote, setRequestNote] = useState("");

  const inviteCode = "THRAVADU-2026-KRL";

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const listToFilter = activeTab === "unconnected" ? unconnectedRelatives : connectedMembers;

  const filteredMembers = listToFilter.filter(m => {
    if (m.id === currentUser.id) return false;
    const matchesQuery = 
      m.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.location && m.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBranch = selectedBranch === "ALL" || m.branchCategory === selectedBranch;

    return matchesQuery && matchesBranch;
  });

  const handleSendConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingPerson) return;
    onConnectRequest(connectingPerson, selectedRelType, requestNote);
    setConnectingPerson(null);
    setRequestNote("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Invite Code Banner */}
      <div className="bg-gradient-to-r from-primary via-indigo-600 to-secondary text-white rounded-3xl p-6 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-accent">
            <Sparkles className="w-3.5 h-3.5" />
            Invite Relatives to Kinship
          </span>
          <h3 className="text-xl font-bold mt-2">
            Share Your Private Family Tree Code
          </h3>
          <p className="text-xs text-white/80 mt-1 max-w-md leading-relaxed">
            Relatives entering this invitation code can instantly discover your tree and request connection.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
          <code className="text-sm font-mono font-bold px-3 py-1 text-white">
            {inviteCode}
          </code>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary rounded-xl text-xs font-bold hover:bg-white/90 transition shadow-sm"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Main Discover Section */}
      <div className="bg-white rounded-3xl border border-line-border p-5 shadow-card space-y-4">
        {/* Toggle between Unconnected vs Connected */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line-border">
          <div className="flex items-center gap-2 p-1 bg-surface-muted rounded-2xl border border-line-border">
            <button
              onClick={() => setActiveTab("unconnected")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                activeTab === "unconnected"
                  ? "bg-primary text-white"
                  : "text-font-muted hover:text-font-main"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Suggested Kin to Connect</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "unconnected" ? "bg-white/20 text-white" : "bg-primary-50 text-primary"}`}>
                {unconnectedRelatives.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("connected")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                activeTab === "connected"
                  ? "bg-primary text-white"
                  : "text-font-muted hover:text-font-main"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Already in Tree ({connectedMembers.length})</span>
            </button>
          </div>

          <p className="text-xs text-font-muted">
            {activeTab === "unconnected" 
              ? "New discoverable relatives from your lineage" 
              : "Relatives currently verified in your tree"}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-font-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search relatives by name or city..."
              className="w-full bg-surface-muted border border-line-border rounded-2xl pl-11 pr-4 py-2 text-xs text-font-main placeholder:text-font-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {["ALL", "IMMEDIATE", "PATERNAL", "MATERNAL", "IN_LAWS", "EXTENDED"].map(branch => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedBranch === branch
                    ? "bg-primary text-white shadow-soft"
                    : "bg-surface-muted text-font-muted hover:text-font-main"
                }`}
              >
                {branch === "ALL" ? "All" : branch}
              </button>
            ))}
          </div>
        </div>

        {/* Requirement 2: Uniform Compact Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2">
          {filteredMembers.map(member => {
            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-line-border p-3.5 shadow-sm hover:border-primary hover:shadow-card transition flex flex-col justify-between h-[155px] group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-line-border shadow-sm flex-shrink-0">
                    <img src={member.avatarUrl} alt={member.displayName} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-font-main truncate">{member.displayName}</h4>
                    <p className="text-[10px] text-font-muted truncate mt-0.5">{member.location || "Kerala, India"}</p>
                    <span className="inline-block mt-1 text-[9.5px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-md truncate max-w-full">
                      {member.branchName || member.branchCategory}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-line-border/60 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-font-muted">
                    {member.discoverability === "public" ? "🌐 Public" : "🔒 Verified"}
                  </span>

                  {activeTab === "unconnected" ? (
                    <button
                      onClick={() => setConnectingPerson(member)}
                      className="flex items-center gap-1 px-3 py-1 bg-primary text-white text-[11px] font-bold rounded-xl hover:bg-primary-hover shadow-sm transition"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Connect</span>
                    </button>
                  ) : (
                    <span className="text-[10.5px] font-semibold text-secondary flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Connected</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredMembers.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-font-muted">
              No relatives found matching the search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Propose Connection Request Modal */}
      {connectingPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-line-border overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-bold text-base">
                  Send Connection Request
                </h3>
              </div>
              <button onClick={() => setConnectingPerson(null)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendConnection} className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-xl border border-line-border">
                <img src={connectingPerson.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-font-main">{connectingPerson.displayName}</h4>
                  <p className="text-[11px] text-font-muted">{connectingPerson.location}</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-font-main mb-1">
                  Proposed Relationship to You:
                </label>
                <select
                  value={selectedRelType}
                  onChange={(e) => setSelectedRelType(e.target.value as RelationshipType)}
                  className="w-full bg-surface-muted border border-line-border rounded-xl px-3 py-2 text-xs font-semibold text-font-main focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="COUSIN">Cousin</option>
                  <option value="SIBLING">Sibling</option>
                  <option value="UNCLE_AUNT">Uncle / Aunt</option>
                  <option value="IN_LAW">In-Law</option>
                  <option value="BIOLOGICAL_PARENT">Parent</option>
                  <option value="CHILD">Child</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-font-main mb-1">
                  Personal Message (Optional):
                </label>
                <textarea
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="Hello, let's connect our branches on Kinship..."
                  rows={3}
                  className="w-full bg-surface-muted border border-line-border rounded-xl p-3 text-xs text-font-main focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="pt-3 border-t border-line-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConnectingPerson(null)}
                  className="px-4 py-2 rounded-xl border border-line-border bg-white text-font-main font-semibold hover:bg-surface-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-soft"
                >
                  Send Connection Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
