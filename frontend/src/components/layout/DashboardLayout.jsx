"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ConnectWalletButton from "@/components/web3/ConnectWalletButton";
import NetworkGuard from "@/components/web3/NetworkGuard";
import Link from "next/link";
import { useAccount } from "wagmi";
import { truncateAddress } from "@/lib/utils";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved) setSidebarCollapsed(JSON.parse(saved));
    const handleStorage = () => {
      const s = localStorage.getItem("sidebar_collapsed");
      if (s) setSidebarCollapsed(JSON.parse(s));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <NetworkGuard>
      <div className="min-h-screen bg-bg-light">
        <Sidebar />
        {/* Top bar for mobile */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-b border-border-clr h-14 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange to-purple flex items-center justify-center">
              <span className="text-white font-bold text-xs">DB</span>
            </div>
            <span className="font-heading font-bold text-sm">DecentraBounty</span>
          </Link>
          <ConnectWalletButton />
        </div>
        {/* Main content area */}
        <main className={`transition-all duration-300 ${sidebarCollapsed ? "md:ml-16" : "md:ml-60"} pt-14 md:pt-0 min-h-screen`}>
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </NetworkGuard>
  );
}
