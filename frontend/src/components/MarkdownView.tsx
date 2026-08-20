import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

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

type Block =
  | { type: "code"; language: string; code: string }
  | { type: "heading"; level: number; text: string }
  | { type: "bullet"; text: string }
  | { type: "numbered"; num: string; text: string }
  | { type: "paragraph"; text: string };

function parseMarkdownBlocks(rawText: string): Block[] {
  const lines = rawText.split("\n");
  const blocks: Block[] = [];
  let inCodeBlock = false;
  let currentLanguage = "";
  let codeBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        blocks.push({
          type: "code",
          language: currentLanguage,
          code: codeBuffer.join("\n"),
        });
        inCodeBlock = false;
        currentLanguage = "";
        codeBuffer = [];
      } else {
        inCodeBlock = true;
        currentLanguage = line.trim().slice(3).trim();
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "heading", level: 1, text: trimmed.slice(2) });
    } else if (trimmed.startsWith("## ")) {
      blocks.push({ type: "heading", level: 2, text: trimmed.slice(3) });
    } else if (trimmed.startsWith("### ")) {
      blocks.push({ type: "heading", level: 3, text: trimmed.slice(4) });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({ type: "bullet", text: trimmed.slice(2) });
    } else {
      const matchNum = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (matchNum) {
        blocks.push({ type: "numbered", num: matchNum[1]!, text: matchNum[2]! });
      } else {
        blocks.push({ type: "paragraph", text: trimmed });
      }
    }
  }

  if (inCodeBlock) {
    blocks.push({
      type: "code",
      language: currentLanguage,
      code: codeBuffer.join("\n"),
    });
  }

  return blocks;
}

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl border border-zinc-800 bg-[#161616] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-[#202020] border-b border-zinc-800 text-xs font-mono text-zinc-400 select-none">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, searchResults = [] }) => {
  const normalizedSources = searchResults.map((item) => {
    if (typeof item === "string") {
      return { url: item, domain: getDomain(item), title: getDomain(item) };
    }
    return { url: item.url, domain: getDomain(item.url), title: item.title || getDomain(item.url) };
  });

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
          <code key={index} className="bg-zinc-800 text-teal-300 text-xs px-1.5 py-0.5 rounded font-mono border border-zinc-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-3 text-zinc-200 text-sm leading-relaxed font-sans">
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return <CodeBlock key={idx} language={block.language} code={block.code} />;
        }

        if (block.type === "heading") {
          if (block.level === 1) {
            return (
              <h1 key={idx} className="text-xl font-bold text-white mt-4 mb-2 tracking-tight">
                {block.text}
              </h1>
            );
          }
          if (block.level === 2) {
            return (
              <h2 key={idx} className="text-lg font-semibold text-white mt-4 mb-1 tracking-tight">
                {block.text}
              </h2>
            );
          }
          return (
            <h3 key={idx} className="text-base font-semibold text-white mt-3 mb-1">
              {block.text}
            </h3>
          );
        }

        if (block.type === "bullet") {
          const listContent = block.text;
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

        if (block.type === "numbered") {
          return (
            <div key={idx} className="flex items-start gap-2 my-1.5 pl-1">
              <span className="text-zinc-400 font-mono text-xs mt-0.5">{block.num}.</span>
              <div className="flex-1">
                <span>{renderFormattedInlineText(block.text)}</span>
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-zinc-300 leading-relaxed">
            {renderFormattedInlineText(block.text)}
          </p>
        );
      })}
    </div>
  );
};

