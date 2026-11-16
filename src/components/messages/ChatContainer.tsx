"use client";

import React, { useState } from "react";
import { Conversation, ChatMessage, PersonProfile } from "@/types/family";
import { formatRelativeTime } from "@/lib/utils";
import { ShieldCheck, Send, Lock, Users, ArrowLeft } from "lucide-react";

interface ChatContainerProps {
  currentUser: PersonProfile;
  conversations: Conversation[];
  lang?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  currentUser,
  conversations: initialConversations,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>(initialConversations[0]?.id || "");
  const [inputText, setInputText] = useState("");

  const activeConv = conversations.find(c => c.id === activeConvId);

  const getChatPartner = (conv: Conversation) => {
    return conv.participants.find(p => p.id !== currentUser.id) || conv.participants[0];
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: currentUser.id,
      sender: currentUser,
      text: inputText,
      createdAt: new Date().toISOString(),
      isEncrypted: true,
      readBy: [currentUser.id],
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: newMessage,
            updatedAt: newMessage.createdAt,
          };
        }
        return c;
      })
    );

    setInputText("");
  };

  return (
    <div className="bg-white rounded-3xl border border-line-border shadow-soft overflow-hidden h-[700px] flex flex-col md:flex-row">
      {/* Conversation List Sidebar */}
      <div className={`w-full md:w-80 border-r border-line-border flex flex-col ${activeConvId && "hidden md:flex"}`}>
        <div className="p-4 border-b border-line-border bg-surface-muted/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-font-main">Family Messages</h3>
            <p className="text-[11px] text-font-muted flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>End-to-End Encrypted</span>
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-line-border/50">
          {conversations.map(conv => {
            const partner = getChatPartner(conv);
            const isGroup = conv.type === "BRANCH_GROUP";
            const title = isGroup ? conv.name : partner.displayName;
            const isSelected = conv.id === activeConvId;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                  isSelected ? "bg-primary-50/70 border-l-4 border-primary" : "hover:bg-surface-muted"
                }`}
              >
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border border-line-border">
                  <img
                    src={isGroup ? "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80" : partner.avatarUrl}
                    alt={title || "Chat"}
                    className="w-full h-full object-cover"
                  />
                  {isGroup && (
                    <span className="absolute bottom-0 right-0 bg-primary text-white p-0.5 rounded-tl-md text-[9px]">
                      <Users className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-font-main truncate">{title}</h4>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-font-muted">
                        {formatRelativeTime(conv.lastMessage.createdAt, "en")}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-font-muted truncate mt-0.5">
                    {conv.lastMessage?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Chat Window */}
      {activeConv ? (
        <div className="flex-1 flex flex-col h-full bg-[#FBFBFE]">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-line-border flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConvId("")}
                className="md:hidden p-1.5 rounded-lg hover:bg-surface-muted text-font-muted"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="w-10 h-10 rounded-xl overflow-hidden border border-line-border flex-shrink-0">
                <img
                  src={
                    activeConv.type === "BRANCH_GROUP"
                      ? "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80"
                      : getChatPartner(activeConv).avatarUrl
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-bold text-sm text-font-main">
                  {activeConv.type === "BRANCH_GROUP"
                    ? activeConv.name
                    : getChatPartner(activeConv).displayName}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-secondary font-medium">
                  <Lock className="w-3 h-3" />
                  <span>End-to-End Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {/* Encryption notice */}
            <div className="mx-auto max-w-sm bg-white/80 backdrop-blur-sm border border-line-border p-2.5 rounded-2xl text-center text-[10.5px] text-font-muted shadow-sm">
              🔒 Messages are secured with end-to-end encryption between verified family members.
            </div>

            {/* Render Messages */}
            {activeConv.lastMessage && (
              <div
                className={`flex flex-col ${
                  activeConv.lastMessage.senderId === currentUser.id ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    activeConv.lastMessage.senderId === currentUser.id
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-font-main border border-line-border rounded-bl-none"
                  }`}
                >
                  <p>{activeConv.lastMessage.text}</p>
                </div>
                <span className="text-[10px] text-font-muted mt-1 px-1">
                  {formatRelativeTime(activeConv.lastMessage.createdAt, "en")}
                </span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-line-border flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a private family message..."
              className="flex-1 bg-surface-muted border border-line-border rounded-xl px-4 py-2.5 text-xs text-font-main placeholder:text-font-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 transition shadow-soft flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-xs text-font-muted">
          Select a conversation to start messaging
        </div>
      )}
    </div>
  );
};
