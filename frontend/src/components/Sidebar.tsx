import React, { useState } from "react";
import {
  Plus,
  Monitor,
  Box,
  Sliders,
  ChevronDown,
  ChevronRight,
  LogOut,
  LogIn,
  MoreHorizontal,
  SidebarClose,
  SidebarOpen,
  Sparkles,
  MessageSquare
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

export interface ConversationItem {
  id: string;
  title: string | null;
}

interface SidebarProps {
  user: User | null;
  conversations: ConversationItem[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onSignOut: () => void;
  onNavigateAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onSignOut,
  onNavigateAuth,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [sessionsExpanded, setSessionsExpanded] = useState(true);

  if (isCollapsed) {
    return (
      <aside className="w-16 h-full bg-[#171717] border-r border-[#262626] flex flex-col items-center py-4 justify-between z-30 flex-shrink-0 transition-all duration-200">
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg hover:bg-[#262626] text-zinc-400 hover:text-white transition-colors"
            title="Expand Sidebar"
          >
            <SidebarOpen className="w-5 h-5" />
          </button>

          <button
            onClick={onNewChat}
            className="p-2.5 rounded-full bg-[#242424] hover:bg-[#2c2c2c] border border-[#333] text-white transition-all shadow"
            title="New Thread"
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center gap-3 mt-2 text-zinc-400">
            <button className="p-2 hover:bg-[#242424] rounded-lg hover:text-white transition-colors" title="Computer">
              <Monitor className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-[#242424] rounded-lg hover:text-white transition-colors" title="Artifacts">
              <Box className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-[#242424] rounded-lg hover:text-white transition-colors" title="Customize">
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {user ? (
            <button
              onClick={onSignOut}
              className="p-2 hover:bg-[#262626] rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onNavigateAuth}
              className="p-2 hover:bg-[#262626] rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Sign In"
            >
              <LogIn className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-full bg-[#171717] border-r border-[#262626] flex flex-col justify-between z-30 flex-shrink-0 select-none transition-all duration-200">
      {/* Top Header & Navigation */}
      <div className="flex flex-col overflow-hidden flex-1">
        {/* Branding header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-white tracking-tight text-base">
            <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>Graphplex</span>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-md hover:bg-[#242424] text-zinc-400 hover:text-white transition-colors"
            title="Collapse Sidebar"
          >
            <SidebarClose className="w-4 h-4" />
          </button>
        </div>

        {/* + New Button */}
        <div className="px-3 mb-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#222222] hover:bg-[#282828] border border-[#2e2e2e] text-sm text-white font-medium transition-all group"
          >
            <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            <span>New</span>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-2 space-y-0.5 text-xs text-zinc-400 font-medium">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#222222] hover:text-white transition-colors">
            <Monitor className="w-4 h-4" />
            <span>Computer</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#222222] hover:text-white transition-colors">
            <Box className="w-4 h-4" />
            <span>Artifacts</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#222222] hover:text-white transition-colors">
            <Sliders className="w-4 h-4" />
            <span>Customize</span>
          </button>
        </div>

        {/* Projects Accordion */}
        <div className="mt-6 px-3">
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-zinc-400 hover:text-zinc-200 mb-2 px-1"
          >
            <span>Projects</span>
            {projectsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {projectsExpanded && (
            <div className="px-2 py-1 text-xs text-zinc-400 italic">No projects</div>
          )}
        </div>

        {/* Sessions Accordion (Conversation History) */}
        <div className="mt-4 px-3 flex-1 flex flex-col min-h-0">
          <button
            onClick={() => setSessionsExpanded(!sessionsExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-zinc-400 hover:text-zinc-200 mb-2 px-1"
          >
            <span>Sessions</span>
            {sessionsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {sessionsExpanded && (
            <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
              {conversations.length === 0 ? (
                <div className="px-2 py-2 text-xs text-zinc-400 italic">No recent sessions</div>
              ) : (
                conversations.map((conv) => {
                  const isActive = conv.id === activeConversationId;
                  const displayTitle = conv.title || "Untitled query";

                  return (
                    <div
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                        isActive
                          ? "bg-[#252525] text-white font-medium border border-[#333]"
                          : "text-zinc-400 hover:bg-[#202020] hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-white" : "text-zinc-400"}`} />
                        <span className="truncate">{displayTitle}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#303030] rounded text-zinc-400 hover:text-white transition-opacity"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-[#262626]">
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#1f1f1f] border border-[#292929]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                {user.email ? user.email[0]!.toUpperCase() : "U"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium text-white truncate">{user.email || "User"}</span>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="p-1.5 hover:bg-[#2a2a2a] rounded-md text-zinc-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onNavigateAuth}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#222222] hover:bg-[#282828] border border-[#2e2e2e] text-xs font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        )}
      </div>
    </aside>
  );
};
