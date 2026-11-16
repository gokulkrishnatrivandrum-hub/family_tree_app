"use client";

import React from "react";
import { PersonProfile, RelationshipEdge } from "@/types/family";
import { Sparkles } from "lucide-react";

interface GenerationalLadderViewProps {
  focusPerson: PersonProfile;
  members: PersonProfile[];
  edges: RelationshipEdge[];
  onSelectPerson: (person: PersonProfile) => void;
  lang?: string;
}

export const GenerationalLadderView: React.FC<GenerationalLadderViewProps> = ({
  focusPerson,
  members,
  onSelectPerson,
}) => {
  const generationTiers = [
    {
      level: "+2",
      title: "Grandparents & Ancestors (+2 Generation)",
      color: "bg-amber-50 border-amber-200 text-amber-800",
      accent: "#F59E0B",
      members: members.filter(m => m.id.includes("grandfather") || m.id.includes("grandmother")),
    },
    {
      level: "+1",
      title: "Parents, Uncles & Aunts (+1 Generation)",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      accent: "#10B981",
      members: members.filter(m => 
        m.id.includes("father") && !m.id.includes("grand") ||
        m.id.includes("mother") && !m.id.includes("grand") ||
        m.id.includes("uncle") ||
        m.id.includes("ammavan")
      ),
    },
    {
      level: "0",
      title: "Self, Spouse, Siblings & 1st Cousins (Current Generation)",
      color: "bg-indigo-50 border-indigo-200 text-indigo-900 ring-2 ring-indigo-400/40",
      accent: "#5B5BD6",
      members: members.filter(m => 
        m.id === focusPerson.id ||
        m.id.includes("spouse") ||
        m.id.includes("sister") ||
        m.id.includes("cousin") ||
        m.id.includes("inlaw-brother")
      ),
    },
    {
      level: "-1",
      title: "Children, Nieces & Nephews (Next Generation)",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      accent: "#3B82F6",
      members: members.filter(m => m.id.includes("child") || m.id.includes("nephew")),
    },
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-line-border p-6 shadow-soft space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-line-border gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Generational Roots Matrix</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-font-main mt-1">
            Lineage Roots & Generations Ladder
          </h2>
          <p className="text-xs text-font-muted mt-0.5">
            Trace your exact lineage offsets and cousin degrees relative to you.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
            Focus: You (0)
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
            +1 Generation
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
            +2 Ancestors
          </span>
        </div>
      </div>

      {/* Vertical Generational Ladders */}
      <div className="space-y-6">
        {generationTiers.map(tier => (
          <div
            key={tier.level}
            className={`rounded-2xl p-4 md:p-5 border ${tier.color} transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-sm"
                  style={{ backgroundColor: tier.accent }}
                >
                  {tier.level}
                </span>
                <div>
                  <h3 className="font-bold text-base text-font-main">
                    {tier.title}
                  </h3>
                  <span className="text-xs text-font-muted">
                    {tier.members.length} members cataloged
                  </span>
                </div>
              </div>

              {tier.level === "0" && (
                <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold tracking-wider uppercase animate-pulse">
                  Your Tier
                </span>
              )}
            </div>

            {/* Member Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {tier.members.map(member => {
                const isHero = member.id === focusPerson.id;

                return (
                  <div
                    key={member.id}
                    onClick={() => onSelectPerson(member)}
                    className={`bg-white rounded-xl p-3 border border-line-border shadow-card flex items-center gap-3 cursor-pointer hover:border-primary hover:shadow-highlight transition-all group ${
                      isHero ? "ring-2 ring-primary bg-primary-50/20" : ""
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                      <img
                        src={member.avatarUrl}
                        alt={member.displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      {member.isDeceased && (
                        <span className="absolute bottom-0 right-0 bg-font-main text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                          🕊
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-font-main truncate">{member.displayName}</p>
                        {isHero && (
                          <span className="text-[9px] bg-primary text-white px-1.5 py-0.2 rounded font-bold">
                            ME
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-font-muted truncate mt-0.5">
                        {member.branchName || member.branchCategory}
                      </p>
                    </div>
                  </div>
                );
              })}

              {tier.members.length === 0 && (
                <div className="col-span-full py-4 text-center text-xs text-font-muted italic">
                  No relatives recorded in this generation yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
