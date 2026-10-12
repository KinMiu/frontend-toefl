import React from "react";
import { Outlet } from "react-router-dom";
import PwaInstallPrompt from "./PwaInstallPrompt";
import PwaBottomNav from "./PwaBottomNav";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PwaInstallPrompt />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <PwaBottomNav />
    </div>
  );
}
