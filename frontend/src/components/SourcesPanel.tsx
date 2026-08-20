import React from "react";
import { ChevronDown, ExternalLink, CheckCircle2, Globe } from "lucide-react";

export interface SearchResultItem {
  title?: string;
  url: string;
  content?: string;
  score?: number;
}

interface SourcesPanelProps {
  sources: (SearchResultItem | string)[];
  isOpen: boolean;
  onClose: () => void;
}

function getDomain(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return urlStr;
  }
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, isOpen, onClose }) => {
  if (!isOpen) return null;

  const normalizedSources = sources.map((item, idx) => {
    if (typeof item === "string") {
      const domain = getDomain(item);
      return {
        id: idx,
        title: domain,
        url: item,
        content: `Source reference link from ${domain}`,
        domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      };
    }
    const domain = getDomain(item.url);
    return {
      id: idx,
      title: item.title || domain,
      url: item.url,
      content: item.content || `Source content from ${domain}`,
      domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
    };
  });

  return (
    <aside className="w-80 h-full bg-[#161616] border-l border-[#262626] flex flex-col flex-shrink-0 z-20 animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-[#262626] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">Sources</h3>
          <span className="text-xs bg-[#242424] text-zinc-400 px-2 py-0.5 rounded-full border border-[#333]">
            {normalizedSources.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#262626] rounded-md text-zinc-400 hover:text-white transition-colors"
          title="Close sources panel"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {normalizedSources.length === 0 ? (
          <div className="text-center text-zinc-500 py-10 text-xs">No web search sources available for this response.</div>
        ) : (
          normalizedSources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-[#1f1f1f] hover:bg-[#252525] border border-[#2b2b2b] hover:border-[#383838] rounded-xl p-3 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <img
                  src={source.favicon}
                  alt={source.domain}
                  className="w-4 h-4 rounded-xs object-contain bg-zinc-800"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors truncate flex-1">
                  {source.domain}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                <ExternalLink className="w-3 h-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>

              <h4 className="text-xs font-medium text-zinc-200 group-hover:text-white line-clamp-2 leading-snug mb-1">
                {source.title}
              </h4>

              <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                {source.content}
              </p>
            </a>
          ))
        )}
      </div>
    </aside>
  );
};
