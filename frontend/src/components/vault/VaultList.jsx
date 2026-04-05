"use client";
import { motion, AnimatePresence } from "framer-motion";
import VaultCard from "./VaultCard";

export default function VaultList({ vaults = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-card h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (vaults.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🛡️</div>
        <h3 className="font-heading font-semibold text-lg text-text-pri mb-2">No vaults found</h3>
        <p className="text-text-sec font-body">No vaults match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {vaults.map((vault) => (
          <motion.div
            key={vault.onChainVaultId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
          >
            <VaultCard vault={vault} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
