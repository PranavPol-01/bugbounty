"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-orange py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
              Start Hunting Bugs Today
            </h2>
            <p className="text-white/80 font-body text-lg mb-8">
              Connect your wallet, explore active vaults, and earn rewards for making Web3 safer.
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-orange font-heading font-semibold rounded-btn border-2 border-white hover:bg-transparent hover:text-white transition-all"
              >
                Connect Wallet
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="text-9xl opacity-30">🛡️</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
