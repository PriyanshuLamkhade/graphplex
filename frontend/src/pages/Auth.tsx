import { useState } from "react";
import { createSupabaseClient } from "@/lib/client";
import { Sparkles, Loader2, ShieldCheck } from "lucide-react";

const supabase = createSupabaseClient();

export default function Auth() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function login(provider: "google" | "github") {
    try {
      setLoadingProvider(provider);
      setErrorMsg(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setLoadingProvider(null);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred.");
      setLoadingProvider(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Glow Effects */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-[#1c1c1c]/90 border border-zinc-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-black/80 flex flex-col items-center text-center space-y-6">
        
        {/* Brand Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/10 border border-teal-500/30 flex items-center justify-center shadow-inner">
          <Sparkles className="w-7 h-7 text-teal-400" />
        </div>

        {/* Header Text */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Welcome to GraphPlex
          </h1>
          <p className="text-sm text-zinc-400 max-w-xs mx-auto">
            Discover, search, and converse with an intelligent AI assistant.
          </p>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="w-full text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl p-3 text-left">
            {errorMsg}
          </div>
        )}

        {/* Login Buttons */}
        <div className="w-full space-y-3 pt-2">
          {/* Google Login Button */}
          <button
            onClick={() => login("google")}
            disabled={loadingProvider !== null}
            className="w-full h-11 px-4 bg-[#262626] hover:bg-[#2f2f2f] active:scale-[0.99] border border-zinc-700/60 hover:border-zinc-500 text-zinc-100 font-medium rounded-xl transition-all duration-150 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loadingProvider === "google" ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
            )}
            <span className="text-sm font-medium">Continue with Google</span>
          </button>

          {/* GitHub Login Button */}
          <button
            onClick={() => login("github")}
            disabled={loadingProvider !== null}
            className="w-full h-11 px-4 bg-[#262626] hover:bg-[#2f2f2f] active:scale-[0.99] border border-zinc-700/60 hover:border-zinc-500 text-zinc-100 font-medium rounded-xl transition-all duration-150 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loadingProvider === "github" ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0 fill-current text-zinc-100 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span className="text-sm font-medium">Continue with GitHub</span>
          </button>
        </div>

        {/* Security Badge & Terms */}
        <div className="pt-4 border-t border-zinc-800/80 w-full space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-teal-500/80" />
            <span>Secure OAuth 2.0 Authentication</span>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
}
