import React from "react";

interface SearchResultItem {
  title?: string;
  url: string;
  content?: string;
  score?: number;
}

interface MarkdownViewProps {
  content: string;
  searchResults?: (SearchResultItem | string)[];
}

function getDomain(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return urlStr;
  }
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, searchResults = [] }) => {
  const normalizedSources = searchResults.map((item) => {
    if (typeof item === "string") {
      return { url: item, domain: getDomain(item), title: getDomain(item) };
    }
    return { url: item.url, domain: getDomain(item.url), title: item.title || getDomain(item.url) };
  });

  const lines = content.split("\n");

  const renderFormattedInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-zinc-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="bg-zinc-800 text-zinc-300 text-xs px-1.5 py-0.5 rounded font-mono border border-zinc-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-3 text-zinc-200 text-sm leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-xl font-bold text-white mt-4 mb-2 tracking-tight">
              {trimmed.slice(2)}
            </h1>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-lg font-semibold text-white mt-4 mb-1 tracking-tight">
              {trimmed.slice(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-base font-semibold text-white mt-3 mb-1">
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const listContent = trimmed.slice(2);
          const matchingSource = normalizedSources.find(
            (s) => listContent.toLowerCase().includes(s.domain.toLowerCase()) || listContent.toLowerCase().includes(s.title.toLowerCase())
          );

          return (
            <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-1">
              <span className="text-zinc-500 mt-1 text-xs">•</span>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span>{renderFormattedInlineText(listContent)}</span>
                {matchingSource && (
                  <a
                    href={matchingSource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#242424] hover:bg-[#2c2c2c] border border-[#333] text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {matchingSource.domain}
                  </a>
                )}
              </div>
            </div>
          );
        }

        const matchNumber = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (matchNumber) {
          const num = matchNumber[1];
          const itemText = matchNumber[2];
          return (
            <div key={idx} className="flex items-start gap-2 my-1.5 pl-1">
              <span className="text-zinc-400 font-mono text-xs mt-0.5">{num}.</span>
              <div className="flex-1">
                <span>{renderFormattedInlineText(itemText!)}</span>
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-zinc-300 leading-relaxed">
            {renderFormattedInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
