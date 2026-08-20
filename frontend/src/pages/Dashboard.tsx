import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/client";
import { BACKEND_URL } from "@/lib/config";
import { Sidebar, type ConversationItem } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";
import { SourcesPanel, type SearchResultItem } from "@/components/SourcesPanel";
import { MessageItem, type ChatMessage } from "@/components/MessageItem";
import { InputBox } from "@/components/InputBox";
import { Sparkles, Globe, ExternalLink, ArrowRight, Layers } from "lucide-react";

interface Turn {
  id: string;
  userQuery: string;
  assistantMessage?: ChatMessage;
  searchResults: (SearchResultItem | string)[];
  followUpQuestions?: string[] | string;
}

const supabase = createSupabaseClient();

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Dashboard states
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [activeSources, setActiveSources] = useState<(SearchResultItem | string)[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"answer" | "links" | "images">("answer");
  const [sourcesPanelOpen, setSourcesPanelOpen] = useState(false);

  const bottomScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll on new turn or loading update
  const scrollToBottom = () => {
    setTimeout(() => {
      bottomScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Check auth status
  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        navigate("/auth");
      }
    }
    checkAuth();
  }, [navigate]);

  // Fetch user conversations from backend
  const fetchConversations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const res = await axios.get(`${BACKEND_URL}/conversations`, {
        headers: { Authorization: token },
      });

      if (res.data && Array.isArray(res.data.conversations)) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Load a single conversation history
  const handleSelectConversation = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    setTurns([]);
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await axios.get(`${BACKEND_URL}/conversations/${conversationId}`, {
        headers: { Authorization: token },
      });

      if (res.data && res.data.messages) {
        setActiveTitle(res.data.title || "Conversation");
        const rawMessages: any[] = res.data.messages;

        // Group raw messages into turn pairs (User message -> Assistant message)
        const constructedTurns: Turn[] = [];
        let currentTurn: Turn | null = null;
        const allSources: (SearchResultItem | string)[] = [];

        rawMessages.forEach((msg, idx) => {
          if (msg.role === "User") {
            if (currentTurn) {
              constructedTurns.push(currentTurn);
            }
            currentTurn = {
              id: msg.id ? String(msg.id) : `turn-${idx}`,
              userQuery: msg.content,
              searchResults: [],
            };
          } else if (msg.role === "Assistant") {
            const sources = msg.searchResults || [];
            if (Array.isArray(sources)) {
              allSources.push(...sources);
            }
            if (currentTurn) {
              currentTurn.assistantMessage = {
                id: msg.id,
                role: "Assistant",
                content: msg.content,
                searchResults: sources,
                searchSummary: msg.searchSummary,
                createdAt: msg.createdAt,
              };
              currentTurn.searchResults = sources;
              constructedTurns.push(currentTurn);
              currentTurn = null;
            } else {
              constructedTurns.push({
                id: msg.id ? String(msg.id) : `turn-${idx}`,
                userQuery: "",
                assistantMessage: {
                  id: msg.id,
                  role: "Assistant",
                  content: msg.content,
                  searchResults: sources,
                  searchSummary: msg.searchSummary,
                  createdAt: msg.createdAt,
                },
                searchResults: sources,
              });
            }
          }
        });

        if (currentTurn) {
          constructedTurns.push(currentTurn);
        }

        setTurns(constructedTurns);
        setActiveSources(allSources);
      }
    } catch (err) {
      console.error("Error loading conversation detail:", err);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  // Start fresh chat state
  const handleNewChat = () => {
    setActiveConversationId(null);
    setActiveTitle("");
    setTurns([]);
    setActiveSources([]);
  };

  // Send initial query or follow-up query
  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const newTurnId = `turn-${Date.now()}`;
    const initialTurn: Turn = {
      id: newTurnId,
      userQuery: queryText,
      searchResults: [],
    };

    setTurns((prev) => [...prev, initialTurn]);
    setIsLoading(true);
    scrollToBottom();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!activeConversationId) {
        // First query in new conversation -> POST /conversation_ask
        const res = await axios.post(
          `${BACKEND_URL}/conversation_ask`,
          { query: queryText },
          { headers: { Authorization: token } }
        );

        if (res.data) {
          const convId = res.data.conversation?.id;
          const convTitle = res.data.conversation?.title || queryText;
          if (convId) {
            setActiveConversationId(convId);
            setActiveTitle(convTitle);
          }

          const assistantMsg = res.data.message;
          const searchResults = res.data.searchResults || [];
          const followUpQuestions = res.data.followUpQuestions;

          setTurns((prev) =>
            prev.map((t) =>
              t.id === newTurnId
                ? {
                    ...t,
                    assistantMessage: assistantMsg,
                    searchResults: searchResults,
                    followUpQuestions: followUpQuestions,
                  }
                : t
            )
          );

          setActiveSources((prev) => [...prev, ...searchResults]);
          fetchConversations();
        }
      } else {
        // Follow-up query -> POST /conversation_ask/follow_up
        const res = await axios.post(
          `${BACKEND_URL}/conversation_ask/follow_up`,
          {
            conversationId: activeConversationId,
            query: queryText,
          },
          { headers: { Authorization: token } }
        );

        if (res.data) {
          const assistantMsg = res.data.message;
          const followUpQuestions = res.data.followUpQuestions;
          const searchResults =
            res.data.searchResults || res.data.reuslt?.searchResults || [];

          setTurns((prev) =>
            prev.map((t) =>
              t.id === newTurnId
                ? {
                    ...t,
                    assistantMessage: assistantMsg,
                    searchResults: searchResults,
                    followUpQuestions: followUpQuestions,
                  }
                : t
            )
          );

          setActiveSources((prev) => [...prev, ...searchResults]);
        }
      }
    } catch (err) {
      console.error("Error asking query:", err);
      // Fallback error assistant response turn
      setTurns((prev) =>
        prev.map((t) =>
          t.id === newTurnId
            ? {
                ...t,
                assistantMessage: {
                  role: "Assistant",
                  content: "Sorry, an error occurred while generating the answer. Please try again.",
                },
              }
            : t
        )
      );
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setConversations([]);
    handleNewChat();
    navigate("/auth");
  };

  return (
    <div className="h-screen w-screen flex bg-[#171717] text-zinc-100 font-sans overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        user={user}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onSignOut={handleSignOut}
        onNavigateAuth={() => navigate("/auth")}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sourcesCount={activeSources.length}
          sourcesPanelOpen={sourcesPanelOpen}
          onToggleSources={() => setSourcesPanelOpen(!sourcesPanelOpen)}
          onShare={() => {
            if (window.location.href) {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
        />

        {/* View Content Body */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto flex flex-col justify-between custom-scrollbar px-4 md:px-8">
            {turns.length === 0 ? (
              /* Hero Empty Home State */
              <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full my-auto py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg mb-6 flex items-center justify-center">
                  <div className="w-full h-full bg-[#171717] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight mb-3">
                  Where knowledge begins.
                </h1>
                <p className="text-zinc-400 text-sm mb-8 max-w-md leading-relaxed">
                  Ask anything to search the web, summarize research, and get intelligent answers with real source citations.
                </p>

                {/* Hero Input */}
                <div className="w-full mb-8">
                  <InputBox
                    onSend={handleSendQuery}
                    isLoading={isLoading}
                    placeholder="Ask anything..."
                  />
                </div>

                {/* Example Quick Action Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                  {[
                    "best way to learn rust",
                    "Rust learning roadmap for beginners",
                    "Explain quantum computing simply",
                    "Compare React vs Vue in 2026",
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuery(prompt)}
                      className="px-3 py-1.5 rounded-full bg-[#202020] hover:bg-[#282828] border border-[#2b2b2b] hover:border-[#383838] text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 group"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Conversation Thread View */
              <div className="max-w-3xl mx-auto w-full py-6 space-y-6">
                {activeTab === "answer" && (
                  <>
                    {turns.map((turn, idx) => (
                      <MessageItem
                        key={turn.id}
                        userQuery={turn.userQuery}
                        assistantMessage={turn.assistantMessage}
                        searchResults={turn.searchResults}
                        followUpQuestions={turn.followUpQuestions}
                        isSearching={isLoading && idx === turns.length - 1 && !turn.assistantMessage}
                        onSendFollowUp={handleSendQuery}
                        onToggleSources={() => setSourcesPanelOpen(true)}
                      />
                    ))}
                    <div ref={bottomScrollRef} />
                  </>
                )}

                {activeTab === "links" && (
                  <div className="py-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-400" />
                      <span>Web Search Sources ({activeSources.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeSources.map((source, idx) => {
                        const url = typeof source === "string" ? source : source.url;
                        const title = typeof source === "string" ? source : source.title || source.url;
                        const content = typeof source === "string" ? "" : source.content || "";
                        let domain = url;
                        try {
                          domain = new URL(url).hostname.replace(/^www\./, "");
                        } catch {}

                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-4 rounded-xl bg-[#1e1e1e] hover:bg-[#252525] border border-[#2b2b2b] hover:border-[#3a3a3a] transition-all flex flex-col justify-between group"
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
                                <span>{domain}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                              </div>
                              <h3 className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-1.5">
                                {title}
                              </h3>
                              {content && (
                                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                                  {content}
                                </p>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === "images" && (
                  <div className="py-6 text-center text-zinc-400 text-sm">
                    No image results available for this query thread.
                  </div>
                )}
              </div>
            )}

            {/* Bottom Floating Sticky Input Box when in active conversation */}
            {turns.length > 0 && activeTab === "answer" && (
              <div className="sticky bottom-0 bg-gradient-to-t from-[#171717] via-[#171717]/90 to-transparent pt-4 pb-6 mt-4">
                <div className="max-w-3xl mx-auto w-full">
                  <InputBox
                    onSend={handleSendQuery}
                    isLoading={isLoading}
                    placeholder="Ask a follow-up"
                  />
                </div>
              </div>
            )}
          </main>

          {/* Right Sources Drawer */}
          <SourcesPanel
            sources={activeSources}
            isOpen={sourcesPanelOpen}
            onClose={() => setSourcesPanelOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}