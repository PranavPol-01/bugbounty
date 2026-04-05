"use client";
import { useChainId, useSwitchChain } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 11155111;

export default function NetworkGuard({ children }) {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isWrongNetwork = chainId && chainId !== TARGET_CHAIN_ID;

  return (
    <>
      <AnimatePresence>
        {isWrongNetwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-dark/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="glass-card p-10 text-center max-w-md"
            >
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-heading font-bold text-white mb-3">
                Wrong Network
              </h2>
              <p className="text-text-sec mb-6">
                Please switch to Sepolia testnet to use DecentraBounty.
              </p>
              <button
                onClick={() => switchChain?.({ chainId: TARGET_CHAIN_ID })}
                className="px-8 py-3 bg-orange text-white font-heading font-semibold rounded-btn hover:shadow-glow transition-all"
              >
                Switch to Sepolia
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
