"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ReportList from "@/components/report/ReportList";
import FundVaultModal from "@/components/vault/FundVaultModal";
import { getVault, getReports } from "@/lib/api";
import { formatETH, truncateAddress } from "@/lib/utils";
import { useVaultRead } from "@/hooks/useVault";
import Link from "next/link";

export default function VaultDetailPage() {
  const { vaultId } = useParams();
  const { address } = useAccount();
  const [vault, setVault] = useState(null);
  const [reports, setReports] = useState([]);
  const [showFund, setShowFund] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const { data: onChainVault } = useVaultRead("getVault", [BigInt(vaultId || 0)]);

  useEffect(() => {
    getVault(vaultId).then(setVault).catch(() => {});
    getReports(`vaultId=${vaultId}`).then(setReports).catch(() => setReports([]));
  }, [vaultId]);

  const filteredReports = activeTab === "All" ? reports : reports.filter((r) => r.status === activeTab);
  const isTeam = vault?.programTeam === address?.toLowerCase();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange to-purple flex items-center justify-center text-white font-bold text-xl">
            {(vault?.name || "V")[0]}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-pri">{vault?.name || `Vault #${vaultId}`}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={vault?.active ? "approved" : "pending"} size="sm">{vault?.active ? "Active" : "Paused"}</Badge>
              <span className="text-xs text-text-sec font-body">Gov: {truncateAddress(vault?.governanceAuthority)}</span>
            </div>
          </div>
        </div>
        {isTeam && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFund(true)}>Fund Vault</Button>
          </div>
        )}
      </div>

      {/* Reward Tiers */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Badge variant="critical">Critical: {formatETH(vault?.rewards?.critical)}Ξ</Badge>
        <Badge variant="high">High: {formatETH(vault?.rewards?.high)}Ξ</Badge>
        <Badge variant="medium">Medium: {formatETH(vault?.rewards?.medium)}Ξ</Badge>
        <Badge variant="low">Low: {formatETH(vault?.rewards?.low)}Ξ</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Funded", value: `${formatETH(vault?.totalFunded)} ETH` },
          { label: "Reports", value: reports.length },
          { label: "Active", value: vault?.active ? "Yes" : "No" },
          { label: "Governance", value: truncateAddress(vault?.governanceAuthority) },
        ].map((s, i) => (
          <Card key={i} variant="solid" padding="sm">
            <div className="text-xs text-text-sec font-body">{s.label}</div>
            <div className="text-lg font-heading font-bold text-text-pri">{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Submit CTA */}
      <Link href={`/dashboard/reports/submit?vaultId=${vaultId}`}>
        <div className="bg-gradient-to-r from-orange to-purple p-4 rounded-card mb-8 flex items-center justify-between text-white cursor-pointer hover:shadow-glow transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <span className="font-heading font-semibold">Submit a Report to This Vault</span>
          </div>
          <span>→</span>
        </div>
      </Link>

      {/* Reports Tabs */}
      <div className="flex gap-2 mb-4">
        {["All", "Pending", "Approved", "Rejected", "Paid"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-pill text-sm font-body ${activeTab === tab ? "bg-orange text-white" : "bg-gray-100 text-text-sec"}`}>
            {tab}
          </button>
        ))}
      </div>
      <ReportList reports={filteredReports} />

      <FundVaultModal isOpen={showFund} onClose={() => setShowFund(false)} vaultId={vaultId} />
    </div>
  );
}
