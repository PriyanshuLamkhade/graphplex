import React from "react";
import { Sparkles, Globe, Image as ImageIcon, Share2, MoreHorizontal, Layers } from "lucide-react";

interface TopHeaderProps {
  activeTab: "answer" | "links" | "images";
  onTabChange: (tab: "answer" | "links" | "images") => void;
  sourcesCount: number;
  sourcesPanelOpen: boolean;
  onToggleSources: () => void;
  onShare: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onTabChange,
  sourcesCount,
  sourcesPanelOpen,
  onToggleSources,
  onShare,
}) => {
  return (
    <header className="h-14 border-b border-[#242424] bg-[#171717] px-6 flex items-center justify-between flex-shrink-0 z-10 select-none">
      {/* Tabs */}
      <div className="flex items-center gap-6 text-xs font-medium">
        <button
          onClick={() => onTabChange("answer")}
          className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
            activeTab === "answer"
              ? "border-white text-white font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Answer</span>
        </button>

        <button
          onClick={() => onTabChange("links")}
          className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
            activeTab === "links"
              ? "border-white text-white font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Links</span>
        </button>

        <button
          onClick={() => onTabChange("images")}
          className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
            activeTab === "images"
              ? "border-white text-white font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Images</span>
        </button>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3">
        {/* Sources button */}
        <button
          onClick={onToggleSources}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            sourcesPanelOpen
              ? "bg-[#282828] border-zinc-500 text-white"
              : "bg-[#202020] border-[#303030] text-zinc-300 hover:border-zinc-500 hover:text-white"
          }`}
          title="Toggle sources drawer"
        >
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span>Sources</span>
          {sourcesCount > 0 && (
            <span className="bg-[#2b2b2b] text-zinc-300 font-mono text-[10px] px-1.5 py-0.2 rounded-md">
              {sourcesCount}
            </span>
          )}
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#282828] border border-[#2e2e2e] text-xs font-medium text-white transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        <button
          className="p-1.5 rounded-lg hover:bg-[#242424] text-zinc-400 hover:text-white transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
