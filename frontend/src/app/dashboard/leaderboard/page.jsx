"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { getLeaderboard } from "@/lib/api";
import { formatETH, truncateAddress } from "@/lib/utils";

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("earnings");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(setUsers).catch(() => []).finally(() => setLoading(false));
  }, []);

  const sorted = [...users].sort((a, b) => {
    if (sortBy === "reports") return (b.approvedReports || 0) - (a.approvedReports || 0);
    if (sortBy === "nfts") return (b.nftCount || 0) - (a.nftCount || 0);
    return parseFloat(b.totalEarned || "0") - parseFloat(a.totalEarned || "0");
  });

  const filtered = search
    ? sorted.filter((u) => u.username?.toLowerCase().includes(search.toLowerCase()) || u.address?.includes(search.toLowerCase()))
    : sorted;

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-pri mb-6">Leaderboard</h1>

      {/* Sort Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "earnings", label: "Earnings" },
          { key: "reports", label: "Reports" },
          { key: "nfts", label: "NFTs" },
        ].map((s) => (
          <button key={s.key} onClick={() => setSortBy(s.key)}
            className={`px-4 py-2 rounded-pill text-sm font-body ${sortBy === s.key ? "bg-orange text-white" : "bg-gray-100 text-text-sec"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-12 h-48">
          {[1, 0, 2].map((i) => {
            const user = top3[i];
            const heights = ["h-40", "h-48", "h-32"];
            const medals = ["🥈", "🥇", "🥉"];
            return (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: i * 0.15 }}
                className={`${heights[i]} w-32 bg-white rounded-t-card border border-border-clr flex flex-col items-center justify-center p-4 shadow-card`}
              >
                <div className="text-3xl mb-1">{medals[i]}</div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange to-purple flex items-center justify-center text-white font-bold text-sm mb-1">
                  {(user?.username || user?.address || "?")[0].toUpperCase()}
                </div>
                <p className="font-body text-xs text-text-pri font-medium truncate w-full text-center">
                  {user?.username || truncateAddress(user?.address)}
                </p>
                <p className="text-orange font-heading font-bold text-sm">{formatETH(user?.totalEarned)} ETH</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Search */}
      <Input placeholder="Search by username or address..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <LeaderboardTable users={rest.length > 0 ? rest : filtered} />
      )}
    </div>
  );
}
