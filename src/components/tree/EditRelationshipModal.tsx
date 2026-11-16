"use client";

import React, { useState, useEffect } from "react";
import { RelationshipEdge, PersonProfile, RelationshipType } from "@/types/family";
import { Edit3, Check, X } from "lucide-react";

interface EditRelationshipModalProps {
  edge: RelationshipEdge | null;
  members: PersonProfile[];
  onClose: () => void;
  onSave: (updatedEdge: RelationshipEdge) => void;
  lang?: string;
}

export const EditRelationshipModal: React.FC<EditRelationshipModalProps> = ({
  edge,
  members,
  onClose,
  onSave,
}) => {
  if (!edge) return null;

  const sourcePerson = members.find(m => m.id === edge.fromPersonId);
  const targetPerson = members.find(m => m.id === edge.toPersonId);

  const [relType, setRelType] = useState<RelationshipType>(edge.relationshipType);
  const [customLabel, setCustomLabel] = useState(edge.customLabel || "");

  useEffect(() => {
    if (edge) {
      setRelType(edge.relationshipType);
      setCustomLabel(edge.customLabel || "");
    }
  }, [edge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...edge,
      relationshipType: relType,
      customLabel: customLabel.trim() || undefined,
    });
  };

  const relationshipOptions: { value: RelationshipType; label: string }[] = [
    { value: "BIOLOGICAL_PARENT", label: "Parent (Father / Mother)" },
    { value: "CHILD", label: "Child (Son / Daughter)" },
    { value: "SPOUSE", label: "Spouse / Partner" },
    { value: "SIBLING", label: "Sibling (Brother / Sister)" },
    { value: "COUSIN", label: "Cousin" },
    { value: "IN_LAW", label: "In-Law (Brother/Sister-in-law)" },
    { value: "UNCLE_AUNT", label: "Uncle / Aunt" },
    { value: "GRANDPARENT", label: "Grandparent" },
    { value: "GRANDCHILD", label: "Grandchild" },
    { value: "ADOPTIVE_PARENT", label: "Adoptive Parent" },
    { value: "GUARDIAN", label: "Guardian" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-line-border overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-primary to-[#4338CA] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Edit3 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                Edit Relationship Bond
              </h3>
              <p className="text-xs text-white/80">
                {sourcePerson?.displayName} ➔ {targetPerson?.displayName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-font-main mb-1.5">
              Relationship Type:
            </label>
            <select
              value={relType}
              onChange={(e) => setRelType(e.target.value as RelationshipType)}
              className="w-full bg-surface-muted border border-line-border rounded-xl px-3.5 py-2.5 text-xs text-font-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            >
              {relationshipOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-font-main mb-1.5">
              Custom Family Title (Optional):
            </label>
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="e.g. Elder Brother, Brother-in-law, Paternal Uncle"
              className="w-full bg-surface-muted border border-line-border rounded-xl px-3.5 py-2.5 text-xs text-font-main placeholder:text-font-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-line-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-line-border bg-white text-font-main text-xs font-semibold hover:bg-surface-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-soft transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Relationship</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
