"use client";

import { useState, useEffect } from "react";
import { TrainFront, ShieldAlert, KeyRound, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auto-redirect to home platform since login is disabled
  useEffect(() => {
    router.replace("/");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error?.message || "Invalid credentials");
      }
    } catch {
      setError("Server connection failed. Is the API running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#061428] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Cinematic Custom CSS for Fast Train Streaks */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fast-train {
          0% { transform: translateX(-100vw); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        .train-light-red {
          animation: fast-train 2s linear infinite;
          box-shadow: 0 0 40px 10px rgba(220, 38, 38, 0.6);
        }
        .train-light-blue {
          animation: fast-train 3.5s linear infinite;
          box-shadow: 0 0 40px 10px rgba(56, 189, 248, 0.6);
        }
        .train-light-white {
          animation: fast-train 1.8s linear infinite;
          animation-delay: 1s;
          box-shadow: 0 0 40px 10px rgba(255, 255, 255, 0.8);
        }
      `}} />

      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      
      {/* Fast Moving Train Streaks */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {/* Top Track */}
        <div className="absolute top-[20%] w-32 h-1 bg-red-500 rounded-full train-light-red blur-[1px]" />
        {/* Middle Track */}
        <div className="absolute top-[50%] w-48 h-[2px] bg-sky-400 rounded-full train-light-blue blur-[1px] delay-500" />
        {/* Bottom Track */}
        <div className="absolute bottom-[25%] w-24 h-1 bg-white rounded-full train-light-white blur-[2px]" />
        {/* Far Background Track */}
        <div className="absolute bottom-[40%] w-64 h-[1px] bg-red-600 rounded-full train-light-red blur-sm delay-1000" style={{ animationDuration: '4s' }} />
      </div>

      {/* Radial Vignette for Cinematic Focus */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#020813] opacity-80 pointer-events-none" />

      {/* Login Card */}
      <div className="z-10 bg-white p-10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] w-full max-w-md transform transition-all duration-500 border-t-4 border-red-600 relative overflow-hidden">
        
        {/* Accent Corner Design */}
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl" />

        <div className="flex flex-col items-center justify-center mb-8 relative z-10">
          <div className="bg-[#061428] p-4 rounded-xl mb-5 shadow-lg">
            <TrainFront className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#061428] tracking-tight">BlockTrain</h1>
          <p className="text-red-600 text-xs font-bold mt-1 uppercase tracking-widest">
            Central Dispatch System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-md flex items-center gap-3 text-red-800 text-sm shadow-sm">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#061428] uppercase tracking-widest mb-2 block">
              Dispatcher ID
            </label>
            <div className="relative group">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-[#061428] pl-10 pr-4 py-3.5 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                placeholder="Enter your ID"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#061428] uppercase tracking-widest mb-2 block">
              Security Key
            </label>
            <div className="relative group">
              <KeyRound className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-[#061428] pl-10 pr-4 py-3.5 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide uppercase text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Authorize Access"
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-slate-100 pt-5">
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
            Restricted Government Network
          </p>
        </div>
      </div>
    </div>
  );
}
