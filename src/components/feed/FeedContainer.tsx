"use client";

import React from "react";
import { Post, PersonProfile, ConnectionRequest } from "@/types/family";
import { PostComposer } from "./PostComposer";
import { PostCard } from "./PostCard";
import { GitMerge, Sparkles, Plus } from "lucide-react";

interface FeedContainerProps {
  currentUser: PersonProfile;
  posts: Post[];
  onAddPost: (post: Omit<Post, "id" | "reactions" | "comments" | "sharesCount" | "createdAt">) => void;
  pendingRequest: ConnectionRequest | null;
  onOpenRequestModal: () => void;
  familyMembers: PersonProfile[];
  onSelectMember: (member: PersonProfile) => void;
}

export const FeedContainer: React.FC<FeedContainerProps> = ({
  currentUser,
  posts,
  onAddPost,
  pendingRequest,
  onOpenRequestModal,
  familyMembers,
  onSelectMember,
}) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Memories & Reels Stories Tray */}
      <div className="bg-white rounded-3xl border border-line-border p-4 shadow-card overflow-x-auto scrollbar-none flex items-center gap-4">
        {/* Add Memory Story */}
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
          <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-primary flex items-center justify-center bg-primary-50 text-primary group-hover:scale-105 transition shadow-sm">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-font-main mt-1.5 truncate max-w-[70px]">
            Add Story
          </span>
        </div>

        {/* Family Member Stories */}
        {familyMembers.slice(1, 8).map(member => {
          return (
            <div
              key={member.id}
              onClick={() => onSelectMember(member)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            >
              <div className="relative w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-primary via-accent to-secondary shadow-sm group-hover:scale-105 transition">
                <img
                  src={member.avatarUrl}
                  alt={member.displayName}
                  className="w-full h-full object-cover rounded-xl border-2 border-white"
                />
              </div>
              <span className="text-[11px] font-semibold text-font-main mt-1.5 truncate max-w-[70px] text-center">
                {member.displayName.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pending Connection Request Alert Banner */}
      {pendingRequest && (
        <div className="bg-gradient-to-r from-primary-50 via-indigo-50 to-purple-50 rounded-3xl border border-primary/20 p-5 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <GitMerge className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  New Connection Request
                </span>
                <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
              </div>
              <h4 className="font-bold text-sm text-font-main mt-0.5">
                {pendingRequest.requester.displayName} wants to join as your {pendingRequest.branchName}
              </h4>
              <p className="text-xs text-font-muted">
                Preview the lineage tree merge and mutual links before approving
              </p>
            </div>
          </div>

          <button
            onClick={onOpenRequestModal}
            className="flex-shrink-0 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover shadow-soft transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Inspect Tree Merge</span>
          </button>
        </div>
      )}

      {/* Post Composer */}
      <PostComposer currentUser={currentUser} onAddPost={onAddPost} />

      {/* Posts Stream */}
      <div className="space-y-5">
        {posts.map(post => (
          <PostCard key={post.id} post={post} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
};
