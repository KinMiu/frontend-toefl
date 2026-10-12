import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, PlayCircle, Trophy, Shield, LogOut, Lightbulb } from "lucide-react";

export default function PwaBottomNav() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Don't show bottom nav inside active examination room to avoid accidental touches
  if (location.pathname === "/practice") return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around">
        {/* Dashboard Tab */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            isActive("/dashboard")
              ? "text-blue-400 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Beranda</span>
        </Link>

        {/* Tips & Trik Tab */}
        <Link
          to="/tips-trik"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            isActive("/tips-trik")
              ? "text-amber-400 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Lightbulb className="w-5 h-5 mb-0.5 text-amber-400" />
          <span className="text-[10px] tracking-tight">Tips & Trik</span>
        </Link>

        {/* Start Practice Quick CTA */}
        <Link
          to="/dashboard"
          onClick={() => {
            window.scrollTo({ top: 300, behavior: "smooth" });
          }}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-slate-400 hover:text-blue-400 transition-all"
        >
          <div className="w-9 h-9 -mt-3 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <PlayCircle className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold text-blue-300">Latihan</span>
        </Link>

        {/* Admin Tab (If role === 'admin') */}
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive("/admin")
                ? "text-blue-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Admin</span>
          </Link>
        )}

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-slate-400 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Keluar</span>
        </button>
      </div>
    </nav>
  );
}
