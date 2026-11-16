"use client";

import React, { useState } from "react";
import { PersonProfile, RelationshipEdge, BranchCategory } from "@/types/family";
import { RadialTreeCanvas } from "./RadialTreeCanvas";
import { GenerationalLadderView } from "./GenerationalLadderView";
import { WorldMapView } from "./WorldMapView";
import { ProfileDrawer } from "./ProfileDrawer";
import { EditRelationshipModal } from "./EditRelationshipModal";
import { Sparkles, Layers, Search, Globe, Users, ShieldCheck, X } from "lucide-react";

interface FamilyTreeContainerProps {
  currentUser: PersonProfile;
  members: PersonProfile[];
  edges: RelationshipEdge[];
  onSendMessage: (person: PersonProfile) => void;
  onUpdateEdge: (updatedEdge: RelationshipEdge) => void;
  onDisconnectMember: (person: PersonProfile) => void;
}

export const FamilyTreeContainer: React.FC<FamilyTreeContainerProps> = ({
  currentUser,
  members,
  edges,
  onSendMessage,
  onUpdateEdge,
  onDisconnectMember,
}) => {
  // 3 View Modes: "radial" | "generational" | "map"
  const [viewMode, setViewMode] = useState<"radial" | "generational" | "map">("radial");
  const [selectedPerson, setSelectedPerson] = useState<PersonProfile | null>(null);
  const [activeBranchFilter, setActiveBranchFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingEdge, setEditingEdge] = useState<RelationshipEdge | null>(null);
  const [highlightedPathNodeIds, setHighlightedPathNodeIds] = useState<string[]>([]);

  const filteredMembers = members.filter(m => {
    const matchesBranch = activeBranchFilter === "ALL" || m.branchCategory === activeBranchFilter || m.id === currentUser.id;
    const matchesSearch = !searchQuery.trim() || 
      m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBranch && matchesSearch;
  });

  const handleEditRelationshipForPerson = (person: PersonProfile) => {
    const edge = edges.find(e => 
      (e.fromPersonId === currentUser.id && e.toPersonId === person.id) ||
      (e.toPersonId === currentUser.id && e.fromPersonId === person.id) ||
      e.fromPersonId === person.id ||
      e.toPersonId === person.id
    );
    if (edge) {
      setEditingEdge(edge);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Family Metrics Bar (Requirement 7: Total Count) */}
      <div className="bg-white rounded-3xl border border-line-border p-4 shadow-card flex flex-wrap items-center justify-between gap-4">
        {/* Total Members Count Metric */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary flex items-center justify-center font-bold text-lg shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-font-main leading-none">
                {members.length}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-50 px-2 py-0.5 rounded-full">
                Total Family Members
              </span>
            </div>
            <p className="text-xs text-font-muted mt-0.5">
              {edges.length} verified relationship connections across 4 generations
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Radial Constellation vs Generational Matrix vs World Map) */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-2xl border border-line-border">
          <button
            onClick={() => { setViewMode("radial"); setHighlightedPathNodeIds([]); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              viewMode === "radial"
                ? "bg-primary text-white"
                : "text-font-muted hover:text-font-main"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Radial Constellation</span>
          </button>

          <button
            onClick={() => { setViewMode("generational"); setHighlightedPathNodeIds([]); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              viewMode === "generational"
                ? "bg-primary text-white"
                : "text-font-muted hover:text-font-main"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Generational Roots</span>
          </button>

          {/* Requirement 6: World Map Lineage View */}
          <button
            onClick={() => { setViewMode("map"); setHighlightedPathNodeIds([]); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              viewMode === "map"
                ? "bg-primary text-white"
                : "text-font-muted hover:text-font-main"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>World Map Lineage</span>
          </button>
        </div>
      </div>

      {/* Path Highlight Active Notice (Requirement 8) */}
      {highlightedPathNodeIds.length > 0 && (
        <div className="p-3 bg-secondary-light/80 border border-secondary/30 rounded-2xl flex items-center justify-between text-xs text-secondary font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span>Focus Mode: Showing exact connection path between You and selected relative</span>
          </div>
          <button
            onClick={() => setHighlightedPathNodeIds([])}
            className="flex items-center gap-1 text-[11px] underline hover:text-secondary-hover"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Tree View</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar (Only for Radial/Generational) */}
      {viewMode !== "map" && (
        <div className="bg-white rounded-3xl border border-line-border p-3.5 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-font-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member by name or location..."
              className="w-full bg-surface-muted border border-line-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-font-main placeholder:text-font-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {["ALL", "IMMEDIATE", "PATERNAL", "MATERNAL", "IN_LAWS"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveBranchFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition ${
                  activeBranchFilter === cat
                    ? "bg-secondary text-white shadow-soft"
                    : "bg-surface-muted text-font-muted hover:text-font-main"
                }`}
              >
                {cat === "ALL" ? "All Branches" : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Visual Display */}
      {viewMode === "radial" && (
        <RadialTreeCanvas
          focusPersonId={currentUser.id}
          members={filteredMembers}
          edges={edges}
          onSelectPerson={(person) => setSelectedPerson(person)}
          onEditRelationship={(edge) => setEditingEdge(edge)}
          selectedPersonId={selectedPerson?.id}
          highlightedPathNodeIds={highlightedPathNodeIds}
        />
      )}

      {viewMode === "generational" && (
        <GenerationalLadderView
          focusPerson={currentUser}
          members={filteredMembers}
          edges={edges}
          onSelectPerson={(person) => setSelectedPerson(person)}
          lang="en"
        />
      )}

      {viewMode === "map" && (
        <WorldMapView
          focusPersonId={currentUser.id}
          members={members}
          onSelectPerson={(person) => setSelectedPerson(person)}
        />
      )}

      {/* Selected Person Profile Drawer */}
      <ProfileDrawer
        person={selectedPerson}
        currentUserId={currentUser.id}
        members={members}
        edges={edges}
        onClose={() => setSelectedPerson(null)}
        onSendMessage={(person) => {
          setSelectedPerson(null);
          onSendMessage(person);
        }}
        onAddRelative={(person) => {
          alert(`Add relative flow initiated for ${person.displayName}`);
        }}
        onEditRelationship={(person) => handleEditRelationshipForPerson(person)}
        onDisconnectMember={(person) => {
          onDisconnectMember(person);
          setSelectedPerson(null);
        }}
        onHighlightPath={(nodeIds) => setHighlightedPathNodeIds(nodeIds)}
        isPathHighlighted={highlightedPathNodeIds.length > 0}
      />

      {/* Edit Relationship Modal */}
      <EditRelationshipModal
        edge={editingEdge}
        members={members}
        onClose={() => setEditingEdge(null)}
        onSave={(updated) => {
          onUpdateEdge(updated);
          setEditingEdge(null);
        }}
        lang="en"
      />
    </div>
  );
};
