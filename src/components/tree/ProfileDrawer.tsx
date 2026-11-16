"use client";

import React, { useState } from "react";
import { PersonProfile, RelationshipEdge } from "@/types/family";
import { findLineagePath } from "@/lib/services/graph-engine";
import { translations, Language } from "@/lib/i18n/translations";
import { 
  X, 
  MessageSquare, 
  UserPlus, 
  UserMinus, 
  Edit3, 
  MapPin, 
  Calendar, 
  Briefcase, 
  ShieldCheck, 
  Sparkles,
  AlertTriangle,
  GitCommit,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";

interface ProfileDrawerProps {
  person: PersonProfile | null;
  currentUserId: string;
  members: PersonProfile[];
  edges: RelationshipEdge[];
  onClose: () => void;
  onSendMessage: (person: PersonProfile) => void;
  onAddRelative: (person: PersonProfile) => void;
  onEditRelationship?: (person: PersonProfile) => void;
  onDisconnectMember?: (person: PersonProfile) => void;
  onHighlightPath?: (nodeIds: string[]) => void;
  isPathHighlighted?: boolean;
  lang?: Language;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  person,
  currentUserId,
  members,
  edges,
  onClose,
  onSendMessage,
  onAddRelative,
  onEditRelationship,
  onDisconnectMember,
  onHighlightPath,
  isPathHighlighted = false,
  lang = "en",
}) => {
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  if (!person) return null;

  const t = translations["en"]; // Pure English
  const isMe = person.id === currentUserId;
  const name = person.displayName;

  // Requirement 8: Calculate exact lineage pathway from Me to this relative
  const lineagePath = !isMe ? findLineagePath(currentUserId, person.id, members, edges) : null;

  const handleConfirmDisconnect = () => {
    if (onDisconnectMember) {
      onDisconnectMember(person);
    }
    setShowDisconnectConfirm(false);
    onClose();
  };

  const toggleHighlightPath = () => {
    if (!onHighlightPath || !lineagePath) return;
    if (isPathHighlighted) {
      onHighlightPath([]);
    } else {
      onHighlightPath(lineagePath.nodeIds);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-line-border flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header with Close Button */}
      <div className="relative h-32 bg-gradient-to-r from-primary via-indigo-600 to-secondary">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-sm z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {person.isDeceased && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 font-medium">
            <span>🕊</span>
            <span>Memorial Profile</span>
          </div>
        )}

        {person.isNewMember && (
          <div className="absolute bottom-3 left-3 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
            ★ NEW MEMBER
          </div>
        )}
      </div>

      {/* Profile Avatar & Primary Info */}
      <div className="px-6 pb-6 pt-0 flex-1 overflow-y-auto">
        <div className="relative -mt-14 mb-4 flex justify-between items-end">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-node bg-surface-muted">
            <img src={person.avatarUrl} alt={name} className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center gap-1 bg-secondary/10 text-secondary px-2.5 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Relative</span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-font-main">{name}</h2>

          {person.branchName && (
            <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg bg-primary-50 text-primary text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>{person.branchName}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {person.bio && (
          <p className="text-xs text-font-muted mt-3 leading-relaxed bg-surface-muted/60 p-3 rounded-xl border border-line-border/50">
            {person.bio}
          </p>
        )}

        {/* Details List */}
        <div className="mt-4 space-y-2 text-xs text-font-main">
          {person.location && (
            <div className="flex items-center gap-2.5 text-font-muted">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{person.location}</span>
            </div>
          )}

          {person.dateOfBirth && (
            <div className="flex items-center gap-2.5 text-font-muted">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>
                Born: {person.dateOfBirth}
                {person.dateOfDeath ? ` — Passed: ${person.dateOfDeath}` : ""}
              </span>
            </div>
          )}

          {person.profession && (
            <div className="flex items-center gap-2.5 text-font-muted">
              <Briefcase className="w-4 h-4 text-accent" />
              <span>{person.profession}</span>
            </div>
          )}
        </div>

        {/* REQUIREMENT 8: Lineage Pathway (How We Are Connected Chain) */}
        {!isMe && lineagePath && lineagePath.steps.length > 0 && (
          <div className="mt-5 p-3.5 bg-[#F8F9FD] rounded-2xl border border-line-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-font-main flex items-center gap-1.5">
                <GitCommit className="w-4 h-4 text-primary" />
                Connection Path to You
              </span>
              <span className="text-[10px] text-font-muted font-semibold bg-white px-2 py-0.5 rounded-full border border-line-border">
                {lineagePath.steps.length} {lineagePath.steps.length === 1 ? "step" : "degrees"}
              </span>
            </div>

            {/* Stepper Chain */}
            <div className="space-y-2">
              {lineagePath.steps.map((step, idx) => (
                <div key={step.edgeId} className="flex items-center gap-2 text-xs bg-white p-2 rounded-xl border border-line-border/60">
                  <span className="w-5 h-5 rounded-full bg-primary-50 text-primary font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-font-main truncate">
                      {step.fromPerson.id === currentUserId ? "You (Me)" : step.fromPerson.displayName}
                    </p>
                    <p className="text-[10px] text-primary font-medium flex items-center gap-1">
                      <span>➔</span>
                      <span>{step.relationLabel}</span>
                      <span>➔</span>
                      <span className="font-semibold text-font-main truncate">{step.toPerson.displayName}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlight Path Toggle Button */}
            <button
              onClick={toggleHighlightPath}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition shadow-sm ${
                isPathHighlighted
                  ? "bg-secondary text-white"
                  : "bg-white text-primary border border-line-border hover:bg-primary-50"
              }`}
            >
              {isPathHighlighted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isPathHighlighted ? "Clear Path Highlight" : "Highlight Connection on Tree"}</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {!isMe && (
          <div className="mt-5 pt-4 border-t border-line-border space-y-2">
            {/* Send Message */}
            <button
              onClick={() => onSendMessage(person)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover shadow-soft transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Private Message</span>
            </button>

            {/* Edit Relationship */}
            {onEditRelationship && (
              <button
                onClick={() => onEditRelationship(person)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-surface-muted text-font-main rounded-xl text-xs font-semibold hover:bg-line-border/40 border border-line-border transition"
              >
                <Edit3 className="w-4 h-4 text-primary" />
                <span>Edit Relationship</span>
              </button>
            )}

            {/* Add Relative from here */}
            <button
              onClick={() => onAddRelative(person)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-surface-muted text-font-main rounded-xl text-xs font-semibold hover:bg-line-border/40 border border-line-border transition"
            >
              <UserPlus className="w-4 h-4 text-secondary" />
              <span>Add Relative from here</span>
            </button>

            {/* Disconnect Member from Tree */}
            {onDisconnectMember && (
              <button
                onClick={() => setShowDisconnectConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-danger hover:bg-red-100/80 rounded-xl text-xs font-semibold border border-red-200 transition"
              >
                <UserMinus className="w-4 h-4" />
                <span>Disconnect from Tree</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Disconnect Confirmation Modal Overlay */}
      {showDisconnectConfirm && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 border border-line-border shadow-2xl space-y-3.5 max-w-xs text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-danger flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-font-main">
              Disconnect Relative?
            </h4>
            <p className="text-xs text-font-muted leading-relaxed">
              Are you sure you want to remove this relative and their connections from your active tree? You can re-connect them later.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDisconnectConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-line-border text-xs font-semibold hover:bg-surface-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDisconnect}
                className="flex-1 py-2 px-3 rounded-xl bg-danger text-white text-xs font-bold hover:bg-red-700 transition"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
