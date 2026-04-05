"use client";
import { motion } from "framer-motion";
import { truncateAddress, formatETH } from "@/lib/utils";

export default function LeaderboardTable({ users = [] }) {
  return (
    <div className="bg-white rounded-card border border-border-clr overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-clr bg-bg-light">
            <th className="px-4 py-3 text-left text-xs font-heading font-semibold text-text-sec">Rank</th>
            <th className="px-4 py-3 text-left text-xs font-heading font-semibold text-text-sec">Researcher</th>
            <th className="px-4 py-3 text-right text-xs font-heading font-semibold text-text-sec">Earned</th>
            <th className="px-4 py-3 text-right text-xs font-heading font-semibold text-text-sec hidden sm:table-cell">Reports</th>
            <th className="px-4 py-3 text-right text-xs font-heading font-semibold text-text-sec hidden md:table-cell">NFTs</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <motion.tr
              key={user._id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-border-clr last:border-0 hover:bg-bg-light/50 transition-colors"
            >
              <td className="px-4 py-3">
                <span className={`font-heading font-bold text-sm ${i < 3 ? "text-orange" : "text-text-sec"}`}>
                  #{i + 1}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange to-purple flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(user.username || user.address || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body font-medium text-sm text-text-pri">{user.username || truncateAddress(user.address)}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-heading font-semibold text-sm text-orange">
                {formatETH(user.totalEarned)} ETH
              </td>
              <td className="px-4 py-3 text-right text-sm text-text-sec font-body hidden sm:table-cell">
                {user.approvedReports || 0}
              </td>
              <td className="px-4 py-3 text-right text-sm text-text-sec font-body hidden md:table-cell">
                {user.nftCount || 0}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
