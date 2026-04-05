"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ConnectWalletButton from "@/components/web3/ConnectWalletButton";

export default function Navbar({ variant = "dark" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = variant === "dark";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 ${isDark ? "bg-bg-dark/90 border-b border-white/10" : "bg-white/80 border-b border-gray-200"} backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange to-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">DB</span>
            </div>
            <span className={`font-heading font-bold text-lg ${isDark ? "text-white" : "text-text-pri"}`}>
              DecentraBounty
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard/vaults" className={`text-sm font-body ${isDark ? "text-gray-300 hover:text-white" : "text-text-sec hover:text-text-pri"} transition-colors`}>Vaults</Link>
            <Link href="/dashboard/leaderboard" className={`text-sm font-body ${isDark ? "text-gray-300 hover:text-white" : "text-text-sec hover:text-text-pri"} transition-colors`}>Leaderboard</Link>
            <Link href="/dashboard" className={`text-sm font-body ${isDark ? "text-gray-300 hover:text-white" : "text-text-sec hover:text-text-pri"} transition-colors`}>Dashboard</Link>
            <ConnectWalletButton />
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <svg className={`w-6 h-6 ${isDark ? "text-white" : "text-text-pri"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-bg-dark flex flex-col p-8"
          >
            <button onClick={() => setMobileOpen(false)} className="self-end text-white text-2xl mb-8">&times;</button>
            <div className="flex flex-col gap-6">
              <Link href="/dashboard/vaults" onClick={() => setMobileOpen(false)} className="text-white text-xl font-heading">Vaults</Link>
              <Link href="/dashboard/leaderboard" onClick={() => setMobileOpen(false)} className="text-white text-xl font-heading">Leaderboard</Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-white text-xl font-heading">Dashboard</Link>
              <ConnectWalletButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
