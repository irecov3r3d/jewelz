"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid access codes.");
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
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Agent password"
            className="bg-gray-950 border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#FDE047] transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#FDE047] text-gray-950 px-4 py-3 rounded font-bold text-sm hover:bg-yellow-300 transition-colors uppercase tracking-wider"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
