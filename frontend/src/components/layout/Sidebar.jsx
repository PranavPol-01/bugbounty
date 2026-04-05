"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Tooltip from "@/components/ui/Tooltip";
import { truncateAddress } from "@/lib/utils";
import { useAccount } from "wagmi";

const navItems = [
  { href: "/dashboard", icon: "⊞", label: "Dashboard" },
  { href: "/dashboard/vaults", icon: "🛡️", label: "Vaults" },
  { href: "/dashboard/reports", icon: "📄", label: "My Reports" },
  { href: "/dashboard/governance", icon: "⚖️", label: "Governance" },
  { href: "/dashboard/profile", icon: "👤", label: "Profile" },
  { href: "/dashboard/leaderboard", icon: "🏆", label: "Leaderboard" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { address } = useAccount();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved) setCollapsed(JSON.parse(saved));
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar_collapsed", JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen bg-bg-dark border-r border-white/10 z-30 flex flex-col hidden md:flex"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 h-16 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange to-purple flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">DB</span>
        </div>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-heading font-bold text-white text-sm">
            DecentraBounty
          </motion.span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-200
                ${isActive
                  ? "text-orange bg-orange/10 border-l-2 border-orange"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
          return collapsed ? <Tooltip key={item.href} text={item.label}>{link}</Tooltip> : link;
        })}
      </nav>

      {/* User Chip */}
      {address && !collapsed && (
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange to-purple" />
            <span className="text-gray-400 text-xs font-body">{truncateAddress(address)}</span>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button onClick={toggleCollapse} className="p-4 border-t border-white/10 text-gray-400 hover:text-white transition-colors">
        {collapsed ? "→" : "←"}
      </button>
    </motion.aside>
  );
}
