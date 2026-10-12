import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Flame, Shield, LogOut, BookOpen, LayoutDashboard, Lightbulb } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-lg">TOEFL ITP</span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-md">
                  ITB PREP
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
                Section 2: Structure & Written Expression
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/dashboard"
                  ? "bg-slate-800 text-blue-400 shadow-inner"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/tips-trik"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/tips-trik"
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-inner"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Tips & Trik</span>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                PENTING
              </span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/admin"
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* ITB Target Badge (Shown on xl screens to give tablet breathing room) */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Target: iBT 88 / ITP 580</span>
            </div>

            {/* Study Streak Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs font-semibold text-orange-400">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Active</span>
            </div>

            {/* User Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-medium text-white truncate max-w-[120px]">
                  {user?.name || "User"}
                </p>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {user?.role === "admin" ? "Admin" : "Mahasiswa"}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Keluar Akun"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
