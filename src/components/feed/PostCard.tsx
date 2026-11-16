"use client";

import React, { useState } from "react";
import { Post, PersonProfile } from "@/types/family";
import { formatRelativeTime } from "@/lib/utils";
import { Heart, MessageCircle, Share2, Shield, Users, Lock, Sparkles, Pin } from "lucide-react";

interface PostCardProps {
  post: Post;
  currentUser: PersonProfile;
  lang?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUser }) => {
  const [likes, setLikes] = useState(post.reactions.length);
  const [hasLiked, setHasLiked] = useState(
    post.reactions.some(r => r.userId === currentUser.id)
  );
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments);

  const authorName = post.author.displayName;

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatarUrl,
      content: commentText,
      createdAt: new Date().toISOString(),
    };

    setCommentsList([newComment, ...commentsList]);
    setCommentText("");
  };

  const getVisibilityTag = () => {
    switch (post.visibility) {
      case "FAMILY_TREE":
        return { label: "Family Tree", icon: <Users className="w-3 h-3 text-primary" /> };
      case "SPECIFIC_BRANCH":
        return { label: "Branch Only", icon: <Sparkles className="w-3 h-3 text-accent" /> };
      case "PRIVATE":
        return { label: "Private", icon: <Lock className="w-3 h-3 text-danger" /> };
      case "PUBLIC":
        return { label: "Public", icon: <Shield className="w-3 h-3 text-secondary" /> };
    }
  };

  const vis = getVisibilityTag();

  return (
    <article className="bg-white rounded-3xl border border-line-border overflow-hidden shadow-card hover:shadow-soft transition-all duration-300">
      {/* Pinned Ribbon if any */}
      {post.isPinned && (
        <div className="bg-primary/10 border-b border-primary/20 px-5 py-1.5 flex items-center gap-1.5 text-xs text-primary font-bold">
          <Pin className="w-3 h-3" />
          <span>Pinned Family Memory</span>
        </div>
      )}

      {/* Post Header */}
      <div className="p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-line-border shadow-sm flex-shrink-0">
            <img src={post.author.avatarUrl} alt={authorName} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-font-main">{authorName}</h4>
              {post.author.branchName && (
                <span className="text-[10px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-full">
                  {post.author.branchName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-font-muted">
              <span>{formatRelativeTime(post.createdAt, "en")}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium bg-surface-muted px-2 py-0.5 rounded-full text-[10.5px]">
                {vis.icon}
                <span>{vis.label}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-5 py-2">
        <p className="text-sm text-font-main leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Media Rendering */}
      {post.mediaUrl && (
        <div className="mt-3 relative bg-surface-muted overflow-hidden max-h-[480px] flex items-center justify-center">
          <img
            src={post.mediaUrl}
            alt="Family Post Media"
            className="w-full h-full object-cover"
          />

          {/* Throwback Year Badge */}
          {post.memoryYear && (
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 border border-white/20">
              <span>🕰</span>
              <span>{post.memoryYear} Memory</span>
            </div>
          )}

          {post.mediaType === "reel" && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
              <span>▶ 0:45</span>
            </div>
          )}
        </div>
      )}

      {/* Post Actions (Like, Comment, Share) */}
      <div className="px-5 py-3 border-t border-line-border flex items-center justify-between text-xs text-font-muted">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              hasLiked ? "text-danger bg-red-50 font-bold" : "hover:bg-surface-muted hover:text-font-main"
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? "fill-danger text-danger" : ""}`} />
            <span>{likes} Love</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-muted hover:text-font-main transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentsList.length} Comments</span>
          </button>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-muted hover:text-font-main transition">
          <Share2 className="w-4 h-4" />
          <span>{post.sharesCount}</span>
        </button>
      </div>

      {/* Comments Drawer / Section */}
      {showComments && (
        <div className="bg-surface-muted/60 p-4 border-t border-line-border space-y-3">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a loving reply..."
              className="flex-1 bg-white border border-line-border rounded-xl px-3.5 py-2 text-xs text-font-main placeholder:text-font-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="bg-primary text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-primary-hover disabled:opacity-50 transition"
            >
              Reply
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-2.5 max-h-52 overflow-y-auto pt-1">
            {commentsList.map(comm => (
              <div key={comm.id} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-line-border/60">
                <img src={comm.authorAvatar} alt={comm.authorName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-font-main">{comm.authorName}</p>
                    <span className="text-[10px] text-font-muted">{formatRelativeTime(comm.createdAt, "en")}</span>
                  </div>
                  <p className="text-xs text-font-muted mt-0.5 leading-relaxed">{comm.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
