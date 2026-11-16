"use client";

import React, { useState } from "react";
import { PersonProfile, VisibilityMode, Post } from "@/types/family";
import { Image, Video, Calendar, Shield, Globe, Users, Lock, Sparkles, Send } from "lucide-react";

interface PostComposerProps {
  currentUser: PersonProfile;
  onAddPost: (post: Omit<Post, "id" | "reactions" | "comments" | "sharesCount" | "createdAt">) => void;
  lang?: string;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  currentUser,
  onAddPost,
}) => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<VisibilityMode>("FAMILY_TREE");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "reel" | "memory">("image");
  const [memoryYear, setMemoryYear] = useState("");
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    onAddPost({
      authorId: currentUser.id,
      author: currentUser,
      content,
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? mediaType : undefined,
      memoryYear: memoryYear || undefined,
      visibility,
      targetBranchIds: visibility === "SPECIFIC_BRANCH" ? ["branch-maternal"] : undefined,
    });

    setContent("");
    setMediaUrl("");
    setMemoryYear("");
  };

  const getVisibilityLabel = () => {
    switch (visibility) {
      case "PRIVATE":
        return { label: "Private (Only Me)", icon: <Lock className="w-3.5 h-3.5 text-danger" />, desc: "Visible only in your private archive." };
      case "FAMILY_TREE":
        return { label: "Family Tree (Verified Relatives)", icon: <Users className="w-3.5 h-3.5 text-primary" />, desc: "Visible to all verified relatives in your active tree." };
      case "SPECIFIC_BRANCH":
        return { label: "Specific Branch Only", icon: <Sparkles className="w-3.5 h-3.5 text-accent" />, desc: "Visible only to members in the selected lineage branch." };
      case "PUBLIC":
        return { label: "Public (Discovery)", icon: <Globe className="w-3.5 h-3.5 text-secondary" />, desc: "Visible to anyone visiting your public profile." };
    }
  };

  const visInfo = getVisibilityLabel();

  return (
    <div className="bg-white rounded-3xl border border-line-border p-5 shadow-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Top User Bar */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border border-line-border shadow-sm flex-shrink-0">
            <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-font-main">
              {currentUser.displayName}
            </h4>
            
            {/* Visibility Selector Button */}
            <div className="relative mt-0.5">
              <button
                type="button"
                onClick={() => setShowAudienceMenu(!showAudienceMenu)}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-muted border border-line-border text-[11px] font-semibold text-font-muted hover:text-font-main hover:bg-line-border/30 transition"
              >
                {visInfo.icon}
                <span>{visInfo.label}</span>
                <span className="text-[10px]">▼</span>
              </button>

              {/* Dropdown Menu */}
              {showAudienceMenu && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-line-border p-2 z-30 space-y-1">
                  <div className="p-2 border-b border-line-border">
                    <p className="text-xs font-bold text-font-main">Post Audience</p>
                    <p className="text-[10.5px] text-font-muted">
                      Select who can view this family post
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setVisibility("FAMILY_TREE"); setShowAudienceMenu(false); }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-start gap-2.5 hover:bg-surface-muted transition ${
                      visibility === "FAMILY_TREE" ? "bg-primary-50 text-primary font-bold" : "text-font-main"
                    }`}
                  >
                    <Users className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Family Tree</p>
                      <p className="text-[10px] text-font-muted font-normal">Visible to all verified relatives in tree</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setVisibility("SPECIFIC_BRANCH"); setShowAudienceMenu(false); }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-start gap-2.5 hover:bg-surface-muted transition ${
                      visibility === "SPECIFIC_BRANCH" ? "bg-accent-light text-amber-900 font-bold" : "text-font-main"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Specific Branch Only</p>
                      <p className="text-[10px] text-font-muted font-normal">Visible only to selected lineage sides</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setVisibility("PRIVATE"); setShowAudienceMenu(false); }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-start gap-2.5 hover:bg-surface-muted transition ${
                      visibility === "PRIVATE" ? "bg-red-50 text-danger font-bold" : "text-font-main"
                    }`}
                  >
                    <Lock className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Private (Only Me)</p>
                      <p className="text-[10px] text-font-muted font-normal">Saved only to your private archive</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setVisibility("PUBLIC"); setShowAudienceMenu(false); }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-start gap-2.5 hover:bg-surface-muted transition ${
                      visibility === "PUBLIC" ? "bg-emerald-50 text-secondary font-bold" : "text-font-main"
                    }`}
                  >
                    <Globe className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Public</p>
                      <p className="text-[10px] text-font-muted font-normal">Visible on public discovery profiles</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text Input (Can be any language: English, Malayalam, etc.) */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a family memory, news, milestone, or celebration..."
          rows={3}
          className="w-full text-sm text-font-main placeholder:text-font-muted/70 bg-surface-muted/60 p-3.5 rounded-2xl border border-line-border/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition"
        />

        {/* Media Preview */}
        {mediaUrl && (
          <div className="relative rounded-2xl overflow-hidden border border-line-border max-h-60 bg-surface-muted">
            <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setMediaUrl("")}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black transition text-xs"
            >
              ✕
            </button>
            {memoryYear && (
              <span className="absolute bottom-2 left-2 bg-accent text-white px-2.5 py-0.5 rounded-lg text-xs font-bold shadow-sm">
                🕰 {memoryYear} Memory
              </span>
            )}
          </div>
        )}

        {/* Bottom Toolbar & Publish Button */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-line-border gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                const sample = "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80";
                setMediaUrl(sample);
                setMediaType("image");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-muted text-font-muted hover:text-font-main text-xs font-semibold transition"
            >
              <Image className="w-4 h-4 text-emerald-500" />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const sample = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80";
                setMediaUrl(sample);
                setMediaType("reel");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-muted text-font-muted hover:text-font-main text-xs font-semibold transition"
            >
              <Video className="w-4 h-4 text-rose-500" />
              <span>Reel / Video</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const sample = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1000&q=80";
                setMediaUrl(sample);
                setMediaType("memory");
                setMemoryYear("1992");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-muted text-font-muted hover:text-font-main text-xs font-semibold transition"
            >
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Throwback</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() && !mediaUrl}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-soft transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post to Family</span>
          </button>
        </div>
      </form>
    </div>
  );
};
