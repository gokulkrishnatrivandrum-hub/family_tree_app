export type RelationshipType =
  | "BIOLOGICAL_PARENT"
  | "ADOPTIVE_PARENT"
  | "GUARDIAN"
  | "CHILD"
  | "SIBLING"
  | "SPOUSE"
  | "PARTNER"
  | "STEP_PARENT"
  | "STEP_CHILD"
  | "IN_LAW"
  | "COUSIN"
  | "UNCLE_AUNT"
  | "NEPHEW_NIECE"
  | "GRANDPARENT"
  | "GRANDCHILD"
  | "OTHER_RELATIVE";

export type VerificationStatus = "verified" | "pending" | "disputed";

export type VisibilityMode = "PRIVATE" | "FAMILY_TREE" | "SPECIFIC_BRANCH" | "PUBLIC";

export type BranchCategory = "IMMEDIATE" | "PATERNAL" | "MATERNAL" | "IN_LAWS" | "EXTENDED";

export interface PersonProfile {
  id: string;
  userId?: string;
  displayName: string;
  malayalamName?: string;
  birthName?: string;
  gender: "male" | "female" | "other";
  avatarUrl: string;
  coverUrl?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  isDeceased?: boolean;
  location?: string;
  bio?: string;
  profession?: string;
  phoneNumber?: string;
  email?: string;
  branchCategory: BranchCategory;
  branchName?: string;
  isNewMember?: boolean;
  coordinates?: { lat: number; lng: number };
  discoverability: "public" | "tree_only" | "private";
  createdAt: string;
}

export interface RelationshipEdge {
  id: string;
  treeId: string;
  fromPersonId: string;
  toPersonId: string;
  relationshipType: RelationshipType;
  customLabel?: string;
  customLabelMl?: string;
  status: VerificationStatus;
  validFrom?: string;
  validTo?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  privacyMode: "private" | "invite_only" | "public_preview";
  createdAt: string;
}

export interface Branch {
  id: string;
  treeId: string;
  name: string;
  malayalamName: string;
  category: BranchCategory;
  color: string;
  description?: string;
}

export interface ConnectionRequest {
  id: string;
  treeId: string;
  requester: PersonProfile;
  targetPersonId: string;
  proposedRelationshipType: RelationshipType;
  branchCategory: BranchCategory;
  branchName: string;
  message?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  // Computed simulation metrics
  simulatedNewNodes: PersonProfile[];
  simulatedEdges: RelationshipEdge[];
  mutualConnections: {
    personId: string;
    displayName: string;
    avatarUrl: string;
    existingRelation: string;
    existingRelationMl: string;
  }[];
}

export interface PostReaction {
  userId: string;
  type: "like" | "love" | "pray" | "celebrate";
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: PersonProfile;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "reel" | "memory";
  memoryYear?: string;
  visibility: VisibilityMode;
  targetBranchIds?: string[];
  reactions: PostReaction[];
  comments: PostComment[];
  sharesCount: number;
  isPinned?: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: PersonProfile;
  text: string;
  mediaUrl?: string;
  createdAt: string;
  isEncrypted: boolean;
  readBy: string[];
}

export interface Conversation {
  id: string;
  type: "DIRECT" | "BRANCH_GROUP";
  name?: string;
  branchCategory?: BranchCategory;
  participants: PersonProfile[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}
