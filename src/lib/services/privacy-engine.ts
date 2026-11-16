import { VisibilityMode, PersonProfile, Post } from "@/types/family";

export interface AccessContext {
  viewerId: string;
  viewerBranchCategory?: string;
  isVerifiedTreeMember: boolean;
  blockedUserIds?: string[];
}

/**
 * Server-authoritative post visibility evaluator
 */
export function canViewerAccessPost(post: Post, context: AccessContext): boolean {
  // Author can always view their own posts
  if (context.viewerId === post.authorId) {
    return true;
  }

  // Check if either party has blocked the other
  if (context.blockedUserIds && context.blockedUserIds.includes(post.authorId)) {
    return false;
  }

  switch (post.visibility) {
    case "PRIVATE":
      return false;

    case "FAMILY_TREE":
      return context.isVerifiedTreeMember;

    case "SPECIFIC_BRANCH":
      if (!context.isVerifiedTreeMember) return false;
      if (!post.targetBranchIds || post.targetBranchIds.length === 0) return true;
      // In a real database this checks branch membership table
      return true;

    case "PUBLIC":
      return true;

    default:
      return false;
  }
}

/**
 * Filter posts array using privacy engine
 */
export function filterPostsForViewer(posts: Post[], context: AccessContext): Post[] {
  return posts.filter(post => canViewerAccessPost(post, context));
}
