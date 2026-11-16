"use client";

import React from "react";
import { ConnectionRequest } from "@/types/family";
import { CheckCircle2, GitMerge, AlertCircle, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";

interface ConnectionRequestModalProps {
  request: ConnectionRequest | null;
  onClose: () => void;
  onApprove: (request: ConnectionRequest) => void;
  onReject: (requestId: string) => void;
  lang?: string;
}

export const ConnectionRequestModal: React.FC<ConnectionRequestModalProps> = ({
  request,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!request) return null;

  const requesterName = request.requester.displayName;

  const handleApprove = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    onApprove(request);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-line-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-primary to-[#4338CA] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <GitMerge className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg">
                Interactive Tree Merge Simulation
              </h3>
              <p className="text-xs text-white/80">
                See how this relative and their branch connect to your tree before accepting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white/90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Requester Identity Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-surface-muted rounded-2xl border border-line-border gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-card flex-shrink-0">
                <img
                  src={request.requester.avatarUrl}
                  alt={requesterName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-base text-font-main">{requesterName}</h4>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    ★ New Member Request
                  </span>
                </div>
                <p className="text-xs text-font-muted mt-0.5">
                  {request.requester.location || "Kerala, India"}
                </p>
                <div className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-primary">
                  <span>Proposed Relation:</span>
                  <span className="px-2 py-0.5 rounded bg-primary-100/60 font-bold">
                    {request.branchName}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-xs text-font-muted bg-white px-3 py-1.5 rounded-xl border border-line-border font-medium">
              Received: Today
            </span>
          </div>

          {/* Note from Requester */}
          {request.message && (
            <div className="p-3.5 bg-accent-light/50 border border-accent/30 rounded-xl text-xs text-font-main">
              <span className="font-bold text-amber-900 block mb-1">
                💬 Note from Requester:
              </span>
              <p className="text-font-muted leading-relaxed italic">
                "{request.message}"
              </p>
            </div>
          )}

          {/* VISUAL MERGE DIAGRAM PREVIEW */}
          <div className="p-5 bg-[#F9FAFE] rounded-2xl border-2 border-dashed border-primary/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                Post-Merge Lineage Simulation
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ✓ {request.mutualConnections.length} Mutual Cross-links Detected
              </span>
            </div>

            {/* Visual Mini Graph Simulation */}
            <div className="relative py-6 px-4 bg-white rounded-xl border border-line-border flex items-center justify-around">
              {/* Node 1: Me */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Me" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-bold text-font-main mt-1.5">
                  You (Me)
                </span>
                <span className="text-[9px] text-font-muted">Existing Tree</span>
              </div>

              {/* Connecting Line 1 */}
              <div className="flex-1 flex flex-col items-center px-2">
                <span className="text-[9.5px] font-bold text-primary mb-1">
                  Cousin Link
                </span>
                <div className="w-full h-0.5 bg-gradient-to-r from-primary via-accent to-secondary relative">
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border border-primary flex items-center justify-center text-[8px]">
                    🔗
                  </span>
                </div>
              </div>

              {/* Node 2: Requester */}
              <div className="flex flex-col items-center relative">
                <span className="absolute -top-3 -right-2 bg-accent text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  NEW
                </span>
                <div className="w-12 h-12 rounded-full border-2 border-accent ring-4 ring-accent/20 overflow-hidden shadow-sm">
                  <img src={request.requester.avatarUrl} alt={requesterName} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-bold text-font-main mt-1.5">{requesterName}</span>
                <span className="text-[9px] text-accent font-semibold">{request.branchCategory}</span>
              </div>

              {/* Connecting Line 2 */}
              <div className="flex-1 flex flex-col items-center px-2">
                <span className="text-[9.5px] font-bold text-secondary mb-1">
                  Maternal Link
                </span>
                <div className="w-full h-0.5 bg-secondary border-dashed relative">
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border border-secondary flex items-center justify-center text-[8px]">
                    🌱
                  </span>
                </div>
              </div>

              {/* Node 3: Mutual Elder */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-secondary overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" alt="Uncle" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-bold text-font-main mt-1.5">
                  Unnikrishnan Pillai
                </span>
                <span className="text-[9px] text-secondary font-medium">Shared Elder</span>
              </div>
            </div>

            {/* Cross-Link Explanation Box */}
            <div className="p-3 bg-white rounded-xl border border-line-border text-xs space-y-1.5">
              <span className="font-bold text-font-main flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-primary" />
                Lineage Connection Verified:
              </span>
              <p className="text-font-muted leading-relaxed">
                Accepting this request will automatically connect their branch to your existing maternal elders (Unnikrishnan Pillai & Meera) and expand your lineage tree.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-5 bg-surface-muted border-t border-line-border flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onReject(request.id)}
            className="px-4 py-2.5 rounded-xl border border-line-border bg-white text-font-muted hover:text-danger hover:border-danger/30 text-xs font-semibold transition"
          >
            Decline Request
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-line-border bg-white text-font-main text-xs font-semibold hover:bg-line-border/40 transition"
            >
              Request Clarification
            </button>

            <button
              onClick={handleApprove}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-soft transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Approve & Connect to Tree</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
