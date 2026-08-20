import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  Monitor,
  ChevronDown,
  Mic,
  ArrowUp,
  Loader2,
  Sparkles
} from "lucide-react";

interface InputBoxProps {
  onSend: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const InputBox: React.FC<InputBoxProps> = ({
  onSend,
  isLoading,
  placeholder = "Ask a follow-up",
}) => {
  const [text, setText] = useState("");
  const [searchMode, setSearchMode] = useState("Search");
  const [modelMode, setModelMode] = useState("Model");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1e1e1e] border border-[#2b2b2b] focus-within:border-[#3e3e3e] rounded-2xl p-3 shadow-2xl transition-all duration-200"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full bg-transparent text-white text-sm placeholder-zinc-500 resize-none outline-none leading-relaxed font-sans px-1"
      />

      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#262626]/50">
        {/* Left Toolbar Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="p-1.5 rounded-lg bg-[#262626] hover:bg-[#303030] text-zinc-400 hover:text-white transition-colors"
            title="Attach source or file"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262626] hover:bg-[#303030] border border-[#333] text-xs font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span>{searchMode}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>
        </div>

        {/* Right Toolbar Options */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262626] hover:bg-[#303030] border border-[#333] text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>{modelMode}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-[#262626] text-zinc-400 hover:text-white transition-colors"
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
              text.trim() && !isLoading
                ? "bg-white text-black hover:bg-zinc-200 active:scale-95"
                : "bg-[#282828] text-zinc-600 cursor-not-allowed border border-[#333]"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
