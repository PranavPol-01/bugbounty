"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatETH } from "@/lib/utils";

export default function VaultCard({ vault }) {
  const available = BigInt(vault.totalFunded || "0") - BigInt(vault.totalPaid || "0");
  const total = BigInt(vault.totalFunded || "1");
  const pct = total > 0n ? Number((available * 100n) / total) : 0;

  return (
    <Link href={`/dashboard/vaults/${vault.onChainVaultId}`}>
      <motion.div
        whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
        className="bg-white border border-border-clr rounded-card p-5 glow-orange cursor-pointer shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {vault.logoUrl ? (
              <img src={vault.logoUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange to-purple flex items-center justify-center text-white font-bold text-sm">
                {(vault.name || "V")[0]}
              </div>
            )}
            <div>
              <h3 className="font-heading font-semibold text-text-pri text-sm">{vault.name}</h3>
              <p className="text-xs text-text-sec font-body">{vault.programTeam?.slice(0, 10)}...</p>
            </div>
          </div>
          <Badge variant={vault.active ? "approved" : "pending"} size="sm">
            {vault.active ? "Active" : "Paused"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="critical" size="sm">C: {formatETH(vault.rewards?.critical)}Ξ</Badge>
          <Badge variant="high" size="sm">H: {formatETH(vault.rewards?.high)}Ξ</Badge>
          <Badge variant="medium" size="sm">M: {formatETH(vault.rewards?.medium)}Ξ</Badge>
          <Badge variant="low" size="sm">L: {formatETH(vault.rewards?.low)}Ξ</Badge>
        </div>

        <div className="mb-2">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${pct > 50 ? "bg-green" : pct > 25 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${Math.max(pct, 2)}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-text-sec font-body">
          <span>{formatETH(available.toString())} / {formatETH(vault.totalFunded)} ETH</span>
          <span className="text-orange font-medium">View →</span>
        </div>
      </motion.div>
    </Link>
  );
}
