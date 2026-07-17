"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === "admin123") {
      localStorage.setItem("admin-auth", "true");
      router.replace("/admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-[28px] border border-zinc-800 bg-zinc-950/60 p-8 shadow-2xl shadow-black/20"
      >
        <h1 className="text-2xl font-semibold text-zinc-100 mb-1">Admin Login</h1>
        <p className="text-sm text-zinc-500 mb-6">Enter your password to access the dashboard.</p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-[#cc6c5c] mb-4"
        />

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-[#cc6c5c] py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Login
        </button>
      </form>
    </div>
  );
}
