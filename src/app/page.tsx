"use client";

import React, { useState } from "react";
import { 
  currentUser, 
  initialFamilyMembers, 
  initialRelationshipEdges, 
  samplePendingRequest, 
  samplePosts, 
  sampleConversations,
  initialDiscoverableRelatives
} from "@/lib/data/mock-family-data";
import { PersonProfile, RelationshipEdge, ConnectionRequest, Post, Conversation, RelationshipType } from "@/types/family";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { FamilyTreeContainer } from "@/components/tree/FamilyTreeContainer";
import { FeedContainer } from "@/components/feed/FeedContainer";
import { DiscoverContainer } from "@/components/discover/DiscoverContainer";
import { ChatContainer } from "@/components/messages/ChatContainer";
import { MemoriesGallery } from "@/components/memories/MemoriesGallery";
import { UserProfileView } from "@/components/profile/UserProfileView";
import { ConnectionRequestModal } from "@/components/connection/ConnectionRequestModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { CheckCircle2, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function AppHome() {
  // Default view: Family Tree (Radial Constellation centerpiece)
  const [activeTab, setActiveTab] = useState<NavTab>("tree");

  // Dynamic state for members, edges, discoverable relatives, and connection requests
  const [members, setMembers] = useState<PersonProfile[]>(initialFamilyMembers);
  const [edges, setEdges] = useState<RelationshipEdge[]>(initialRelationshipEdges);
  const [discoverableRelatives, setDiscoverableRelatives] = useState<PersonProfile[]>(initialDiscoverableRelatives);
  const [pendingRequest, setPendingRequest] = useState<ConnectionRequest | null>(samplePendingRequest);
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modal and toast states
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Update existing relationship between members
  const handleUpdateEdge = (updatedEdge: RelationshipEdge) => {
    setEdges(prev => prev.map(e => e.id === updatedEdge.id ? updatedEdge : e));
    showToast("Relationship bond updated successfully!");
  };

  // Disconnect a member from tree
  const handleDisconnectMember = (person: PersonProfile) => {
    setMembers(prev => prev.filter(m => m.id !== person.id));
    setEdges(prev => prev.filter(e => e.fromPersonId !== person.id && e.toPersonId !== person.id));
    setDiscoverableRelatives(prev => [...prev, person]);
    showToast(`${person.displayName} was removed from your family tree.`);
  };

  // Connect new discoverable relative (Requirement 3 & 4)
  const handleConnectDiscoverableRelative = (
    member: PersonProfile, 
    relationType: RelationshipType, 
    customNote?: string
  ) => {
    // Tag newly connected member as isNewMember (Requirement 4)
    const newMemberWithBadge: PersonProfile = {
      ...member,
      isNewMember: true,
    };

    setMembers(prev => [...prev, newMemberWithBadge]);

    const newEdge: RelationshipEdge = {
      id: `edge-${Date.now()}`,
      treeId: "tree-1",
      fromPersonId: currentUser.id,
      toPersonId: member.id,
      relationshipType: relationType,
      customLabel: relationType.replace("_", " "),
      status: "verified",
      createdBy: currentUser.id,
      approvedAt: new Date().toISOString(),
    };
    setEdges(prev => [...prev, newEdge]);
    setDiscoverableRelatives(prev => prev.filter(m => m.id !== member.id));

    try {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
    } catch (e) {}

    showToast(`🎉 ${member.displayName} successfully connected as a New Member!`);
    setActiveTab("tree");
  };

  // Connection request approved from modal
  const handleApproveConnection = (request: ConnectionRequest) => {
    // Mark simulated new nodes with isNewMember: true
    const newNodesWithBadge = request.simulatedNewNodes.map(node => ({
      ...node,
      isNewMember: true,
    }));

    const updatedMembers = [...members, ...newNodesWithBadge];

    const directEdge: RelationshipEdge = {
      id: `edge-approved-${Date.now()}`,
      treeId: "tree-1",
      fromPersonId: currentUser.id,
      toPersonId: request.requester.id,
      relationshipType: request.proposedRelationshipType,
      customLabel: "Maternal Cousin",
      status: "verified",
      createdBy: request.requester.id,
      approvedBy: currentUser.id,
      approvedAt: new Date().toISOString(),
    };

    const updatedEdges = [...edges, directEdge, ...request.simulatedEdges];

    setMembers(updatedMembers);
    setEdges(updatedEdges);
    setPendingRequest(null);
    setIsRequestModalOpen(false);

    showToast(`🎉 Connection verified! ${request.requester.displayName} added as a New Member to your tree.`);
    setActiveTab("tree");
  };

  const handleRejectConnection = (requestId: string) => {
    setPendingRequest(null);
    setIsRequestModalOpen(false);
    showToast("Connection request declined.");
  };

  const handleAddPost = (newPostData: Omit<Post, "id" | "reactions" | "comments" | "sharesCount" | "createdAt">) => {
    const post: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      reactions: [],
      comments: [],
      sharesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts([post, ...posts]);
    showToast("Post shared to your family feed! ✨");
  };

  const handleSendMessageToPerson = (person: PersonProfile) => {
    const existing = conversations.find(c => 
      c.type === "DIRECT" && c.participants.some(p => p.id === person.id)
    );

    if (existing) {
      setActiveTab("messages");
    } else {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        type: "DIRECT",
        participants: [currentUser, person],
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };
      setConversations([newConv, ...conversations]);
      setActiveTab("messages");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAuthModalOpen(true);
    showToast("Logged out successfully.");
  };

  const handleGoogleSignIn = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${currentUser.displayName}!`);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col font-sans text-font-main">
      {/* Top Navigation Bar */}
      <TopNavbar
        currentUser={currentUser}
        totalMembersCount={members.length}
        isLoggedIn={isLoggedIn}
        pendingRequestsCount={pendingRequest ? 1 : 0}
        onOpenRequests={() => setIsRequestModalOpen(true)}
        onOpenProfile={() => setActiveTab("profile")}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace (Sidebar + Content Viewport) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar on Desktop */}
        <Sidebar
          currentTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          pendingRequestsCount={pendingRequest ? 1 : 0}
        />

        {/* Dynamic Main Page Content */}
        <main className="flex-1 p-4 lg:p-6 min-w-0">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="mb-4 p-4 rounded-2xl bg-primary text-white text-xs font-bold shadow-soft flex items-center justify-between animate-in slide-in-from-top duration-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/20 rounded-lg">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: Family Tree (Radial Constellation, Generational Roots & World Map View) */}
          {activeTab === "tree" && (
            <FamilyTreeContainer
              currentUser={currentUser}
              members={members}
              edges={edges}
              onSendMessage={handleSendMessageToPerson}
              onUpdateEdge={handleUpdateEdge}
              onDisconnectMember={handleDisconnectMember}
            />
          )}

          {/* TAB 2: Family Feed & Reels */}
          {activeTab === "feed" && (
            <FeedContainer
              currentUser={currentUser}
              posts={posts}
              onAddPost={handleAddPost}
              pendingRequest={pendingRequest}
              onOpenRequestModal={() => setIsRequestModalOpen(true)}
              familyMembers={members}
              onSelectMember={(member) => handleSendMessageToPerson(member)}
            />
          )}

          {/* TAB 3: Discover Relatives & Search (Requirement 2 & 3) */}
          {activeTab === "discover" && (
            <DiscoverContainer
              currentUser={currentUser}
              connectedMembers={members}
              unconnectedRelatives={discoverableRelatives}
              onConnectRequest={handleConnectDiscoverableRelative}
            />
          )}

          {/* TAB 4: Messages */}
          {activeTab === "messages" && (
            <ChatContainer
              currentUser={currentUser}
              conversations={conversations}
            />
          )}

          {/* TAB 5: Memories & Timelines */}
          {activeTab === "memories" && (
            <MemoriesGallery />
          )}

          {/* TAB 6: User Profile */}
          {activeTab === "profile" && (
            <UserProfileView
              currentUser={currentUser}
              userPosts={posts.filter(p => p.authorId === currentUser.id)}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        pendingRequestsCount={pendingRequest ? 1 : 0}
      />

      {/* Connection Request & Lineage Merge Simulation Modal */}
      <ConnectionRequestModal
        request={pendingRequest}
        onClose={() => setIsRequestModalOpen(false)}
        onApprove={handleApproveConnection}
        onReject={handleRejectConnection}
      />

      {/* Google Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
}
