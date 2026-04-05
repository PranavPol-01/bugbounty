"use client";
import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function NFTCard({ nft }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 800 }}
      className="bg-bg-dark rounded-card p-4 border border-white/10 cursor-pointer shadow-glass"
    >
      <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-orange/20 to-purple/20 mb-3 flex items-center justify-center">
        <span className="text-5xl">🏅</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white font-heading font-semibold text-sm">DBREP #{nft?.tokenId || "?"}</span>
        <span className="text-xs text-gray-400 font-body">{nft?.severity || "Report"}</span>
      </div>
      <p className="text-xs text-gray-500 font-body mt-1">{nft?.vaultName || "Vault"}</p>
    </motion.div>
  );
}
