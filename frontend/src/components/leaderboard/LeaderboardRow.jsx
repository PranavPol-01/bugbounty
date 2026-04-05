"use client";
import { truncateAddress, formatETH } from "@/lib/utils";

export default function LeaderboardRow({ user, rank }) {
  return (
    <tr className="border-b border-border-clr hover:bg-bg-light/50">
      <td className="px-4 py-3 font-heading font-bold text-sm text-text-sec">#{rank}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange to-purple" />
          <span className="font-body text-sm">{user.username || truncateAddress(user.address)}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right font-heading font-semibold text-sm text-orange">{formatETH(user.totalEarned)} ETH</td>
      <td className="px-4 py-3 text-right text-sm text-text-sec">{user.approvedReports}</td>
      <td className="px-4 py-3 text-right text-sm text-text-sec">{user.nftCount}</td>
    </tr>
  );
}
