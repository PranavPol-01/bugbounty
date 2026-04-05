"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { formatETH, timeAgo, severityFromIndex, statusFromIndex, SEVERITY_COLORS } from "@/lib/utils";

export default function ReportCard({ report }) {
  const severity = report.severity || severityFromIndex(report.severityIndex);
  const status = report.status || statusFromIndex(report.statusIndex);
  const borderColor = SEVERITY_COLORS[severity] || "#3B82F6";

  return (
    <Link href={`/dashboard/reports/${report.onChainReportId}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-card border border-border-clr shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:shadow-card transition-shadow"
        style={{ borderLeft: `4px solid ${borderColor}` }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={severity.toLowerCase()} size="sm">{severity}</Badge>
            <Badge variant={status.toLowerCase()} size="sm">{status}</Badge>
          </div>
          <h4 className="font-heading font-semibold text-sm text-text-pri truncate">{report.title}</h4>
          <p className="text-xs text-text-sec font-body">Vault #{report.vaultId} · {timeAgo(report.submittedAt)}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-heading font-semibold text-orange">{formatETH(report.payout)} ETH</div>
        </div>
      </motion.div>
    </Link>
  );
}
