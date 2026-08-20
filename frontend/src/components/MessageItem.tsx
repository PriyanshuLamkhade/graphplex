import React, { useState } from "react";
import {
  Globe,
  Share2,
  Download,
  Copy,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  CornerDownRight,
  Check,
  Layers
} from "lucide-react";
import { MarkdownView } from "./MarkdownView";
import type { SearchResultItem } from "./SourcesPanel";

export interface ChatMessage {
  id?: number | string;
  role: "User" | "Assistant";
  content: string;
  searchResults?: (SearchResultItem | string)[];
  searchSummary?: string;
  followUpQuestions?: string[] | string;
  createdAt?: string;
}

interface MessageItemProps {
  userQuery?: string;
  assistantMessage?: ChatMessage;
  searchResults?: (SearchResultItem | string)[];
  followUpQuestions?: string[] | string;
  isSearching?: boolean;
  onSendFollowUp: (q: string) => void;
  onToggleSources?: () => void;
}

// Helper to parse follow-up questions from backend format
function parseFollowUps(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((q) => typeof q === "string" && q.trim().length > 0);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.followUpQuestions)) {
        return parsed.followUpQuestions;
      }
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return raw
        .split("\n")
        .map((line) => line.replace(/^[-*•\d.]+\s*/, "").replace(/^↪\s*/, "").trim())
        .filter((line) => line.length > 0 && !line.startsWith("{") && !line.startsWith("}"));
    }
  }
  return [];
}

export const MessageItem: React.FC<MessageItemProps> = ({
  userQuery,
  assistantMessage,
  searchResults = [],
  followUpQuestions,
  isSearching = false,
  onSendFollowUp,
  onToggleSources,
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const parsedFollowUps = parseFollowUps(
    followUpQuestions || assistantMessage?.followUpQuestions
  );

  const mergedSources = searchResults.length > 0
    ? searchResults
    : (assistantMessage?.searchResults || []);

  const handleCopy = () => {
    if (assistantMessage?.content) {
      navigator.clipboard.writeText(assistantMessage.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 my-6 animate-in fade-in duration-300">
      {/* User Query Pill */}
      {userQuery && (
        <div className="flex justify-end">
          <div className="bg-[#242424] border border-[#333] px-4 py-2.5 rounded-2xl text-sm font-medium text-white max-w-lg shadow-sm leading-relaxed">
            {userQuery}
          </div>
        </div>
      )}

      {/* Searching indicator or Assistant response */}
      {(isSearching || assistantMessage) && (
        <div className="space-y-4">
          {/* Searching state indicator */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200 transition-colors w-fit">
            <Globe className={`w-3.5 h-3.5 text-zinc-400 ${isSearching ? "animate-spin" : ""}`} />
            <span>{isSearching ? "Searching the web..." : "Searching the web"}</span>
            <span className="text-zinc-500">&gt;</span>
          </div>

          {/* Assistant Answer Body */}
          {assistantMessage && (
            <div className="space-y-4">
              <MarkdownView
                content={assistantMessage.content}
                searchResults={mergedSources}
              />

              {/* Action Toolbar below response */}
              <div className="flex items-center justify-between pt-3 border-t border-[#222222] text-xs text-zinc-400">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-[#242424] rounded-lg hover:text-white transition-colors"
                    title="Copy answer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    className="p-1.5 hover:bg-[#242424] rounded-lg hover:text-white transition-colors"
                    title="Share response"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-[#242424] rounded-lg hover:text-white transition-colors"
                    title="Export response"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-[#242424] rounded-lg hover:text-white transition-colors"
                    title="Regenerate"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  {mergedSources.length > 0 && (
                    <button
                      onClick={onToggleSources}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#202020] hover:bg-[#282828] border border-[#2d2d2d] text-zinc-300 text-xs ml-1 transition-colors"
                    >
                      <Layers className="w-3 h-3 text-zinc-400" />
                      <span>{mergedSources.length} sources</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLiked(liked === true ? null : true)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      liked === true ? "bg-emerald-950/40 text-emerald-400" : "hover:bg-[#242424] hover:text-white"
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLiked(liked === false ? null : false)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      liked === false ? "bg-red-950/40 text-red-400" : "hover:bg-[#242424] hover:text-white"
                    }`}
                    title="Poor response"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-[#242424] rounded-lg hover:text-white transition-colors"
                    title="More actions"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Follow-ups Questions Section */}
              {parsedFollowUps.length > 0 && (
                <div className="mt-8 pt-4 border-t border-[#242424] space-y-3">
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    Follow-ups
                  </h4>
                  <div className="space-y-1">
                    {parsedFollowUps.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendFollowUp(question)}
                        className="w-full text-left py-2.5 px-3 rounded-xl bg-transparent hover:bg-[#222222] border border-transparent hover:border-[#2e2e2e] flex items-center gap-3 text-xs text-zinc-300 hover:text-white transition-all group cursor-pointer"
                      >
                        <CornerDownRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0" />
                        <span className="leading-snug">{question}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
