"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid access codes.");
      setIsLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center font-mono text-gray-200">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <ShieldAlert className="text-[#FDE047] w-12 h-12" />
        </div>
        <h1 className="text-center text-xl tracking-widest uppercase mb-6 text-white font-bold">
          Restricted Area
        </h1>
        {error && (
          <div className="bg-red-950/50 border border-red-900 rounded p-3 mb-4">
            <p className="text-red-500 text-sm text-center" role="alert" aria-live="polite">
              {error}
            </p>
          </div>
        )}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="agent-password" className="sr-only">
              Agent Password
            </label>
            <input
              id="agent-password"
              type="password"
              placeholder="Agent password"
              className="bg-gray-950 border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#FDE047] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              aria-invalid={!!error}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#FDE047] text-gray-950 px-4 py-3 rounded font-bold text-sm hover:bg-yellow-300 transition-colors uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#FDE047]"
            aria-disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Authenticating...</span>
              </>
            ) : (
              "Authenticate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
