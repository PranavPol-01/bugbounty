"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ReportList from "@/components/report/ReportList";
import Link from "next/link";
import { getReports, getVaults } from "@/lib/api";
import { truncateAddress } from "@/lib/utils";

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

export default function DashboardHome() {
  const { address } = useAccount();
  const [reports, setReports] = useState([]);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (address) {
          const [r, v] = await Promise.all([
            getReports(`researcher=${address}`).catch(() => []),
            getVaults(`programTeam=${address}`).catch(() => []),
          ]);
          setReports(r);
          setVaults(v);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [address]);

  const stats = [
    { label: "Reports Submitted", value: reports.length, icon: "📄" },
    { label: "Approved", value: reports.filter((r) => r.status === "Approved" || r.status === "Paid").length, icon: "✅" },
    { label: "My Vaults", value: vaults.length, icon: "🛡️" },
    { label: "NFTs Earned", value: reports.filter((r) => r.nftMinted).length, icon: "🏅" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-pri">Dashboard</h1>
          <p className="text-text-sec font-body text-sm">Welcome back, {address ? truncateAddress(address) : "connect your wallet"}</p>
        </div>
        <Link href="/dashboard/reports/submit">
          <Button>Submit Report</Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={statVariants}>
            <Card variant="solid" className="flex items-center gap-4">
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-heading font-bold text-text-pri">{stat.value}</div>
                <div className="text-xs text-text-sec font-body">{stat.label}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-text-pri">Recent Reports</h2>
          <Link href="/dashboard/reports" className="text-orange text-sm font-body hover:underline">View All →</Link>
        </div>
        <ReportList reports={reports.slice(0, 5)} loading={loading} />
      </div>
    </div>
  );
}
