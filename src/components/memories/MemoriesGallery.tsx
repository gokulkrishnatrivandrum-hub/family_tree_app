"use client";

import React, { useState } from "react";
import { MapPin, Sparkles, Heart } from "lucide-react";

interface MemoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  taggedRelatives: string[];
}

const mockMemories: MemoryItem[] = [
  {
    id: "mem-1",
    year: "1982",
    title: "Ancestral Tharavadu Wedding Celebration",
    description: "Grandfather Raman Nair and the extended family gathered at the illam for the grand wedding feast.",
    location: "Thrissur, Kerala",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
    taggedRelatives: ["Balakrishnan Nair", "Kalyani Amma"],
  },
  {
    id: "mem-2",
    year: "1994",
    title: "Naming Ceremony & Milestone",
    description: "First birthday and naming celebration with maternal grandparents and Ammavan in Kottayam.",
    location: "Kottayam, Kerala",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
    taggedRelatives: ["Radhamani Amma", "Unnikrishnan Pillai"],
  },
  {
    id: "mem-3",
    year: "2010",
    title: "Family Onam Sadhya Feast",
    description: "Over 40 family members shared the traditional feast on plantain leaves celebrating togetherness.",
    location: "Kochi, Kerala",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    taggedRelatives: ["All Family Members"],
  },
];

export const MemoriesGallery: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("ALL");

  const filtered = selectedYear === "ALL" 
    ? mockMemories 
    : mockMemories.filter(m => m.year === selectedYear);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-line-border p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Family Memory Vault</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-font-main mt-1">
            Preserving Lineage Moments Across Generations
          </h2>
          <p className="text-xs text-font-muted mt-0.5">
            Timeless archives, albums, and milestones cataloged by era.
          </p>
        </div>

        {/* Year Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "1982", "1994", "2010"].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedYear === year
                  ? "bg-accent text-white shadow-soft"
                  : "bg-surface-muted text-font-muted hover:text-font-main"
              }`}
            >
              {year === "ALL" ? "All" : year}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(mem => (
          <div
            key={mem.id}
            className="bg-white rounded-3xl border border-line-border overflow-hidden shadow-card hover:shadow-soft transition group"
          >
            <div className="relative h-64 overflow-hidden bg-surface-muted">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl shadow-lg border border-white/20">
                🕰 {mem.year}
              </span>
              <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-font-main text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <MapPin className="w-3 h-3 text-primary" />
                <span>{mem.location}</span>
              </span>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-base text-font-main">
                {mem.title}
              </h3>
              <p className="text-xs text-font-muted mt-1 leading-relaxed">
                {mem.description}
              </p>

              <div className="mt-4 pt-3 border-t border-line-border flex items-center justify-between text-xs text-font-muted">
                <span className="font-semibold text-primary">
                  {mem.taggedRelatives.length} tagged relatives
                </span>
                <button className="text-danger flex items-center gap-1 hover:scale-105 transition">
                  <Heart className="w-4 h-4 fill-danger/10" />
                  <span>Cherish</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
