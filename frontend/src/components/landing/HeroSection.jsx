"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-bg-dark overflow-hidden">
      {/* Animated Orbs */}
      <div className="orb w-72 h-72 bg-orange top-20 left-10" />
      <div className="orb w-96 h-96 bg-purple bottom-20 right-10" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-white/10 text-sm font-body text-gray-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange" />
            Trustless · Transparent · On-Chain
          </span>

          <h1 className="font-heading font-bold text-white leading-tight mb-6" style={{ fontSize: "clamp(40px, 6vw, 64px)" }}>
            The <span className="gradient-text">Decentralized</span> Bug Bounty Platform
          </h1>

          <p className="text-gray-400 text-lg font-body mb-8 max-w-xl leading-relaxed">
            Create trustless bounty vaults, submit vulnerability reports on-chain,
            and earn ETH rewards with verifiable reputation NFTs.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/vaults/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-orange text-white font-heading font-semibold rounded-btn shadow-glow hover:shadow-[0_0_60px_rgba(255,106,0,0.6)] transition-all"
              >
                Launch a Bounty
              </motion.button>
            </Link>
            <Link href="/dashboard/vaults">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-purple text-white font-heading font-semibold rounded-btn shadow-glow-purple hover:shadow-[0_0_60px_rgba(123,63,242,0.6)] transition-all"
              >
                Find Bugs
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Right - Shield SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative w-80 h-80">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-orange/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-6 rounded-full border-2 border-dashed border-purple/30"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange to-purple flex items-center justify-center shadow-2xl">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
