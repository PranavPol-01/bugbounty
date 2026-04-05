"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { getReports, updateReportStatus } from "@/lib/api";
import { formatETH, timeAgo, truncateAddress } from "@/lib/utils";
import { useReportWrite } from "@/hooks/useReport";
import toast from "react-hot-toast";

export default function GovernancePage() {
  const { address } = useAccount();
  const [reports, setReports] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [reason, setReason] = useState("");
  const [tab, setTab] = useState("Pending");
  const { approveReport, rejectReport, isPending } = useReportWrite();

  useEffect(() => {
    getReports("status=Pending").then(setReports).catch(() => []);
  }, []);

  const handleApprove = async (reportId) => {
    try {
      approveReport(reportId, reason || "Approved");
      toast.success("Approval transaction sent!");
    } catch { toast.error("Failed"); }
  };

  const handleReject = async (reportId) => {
    try {
      rejectReport(reportId, reason || "Rejected");
      toast.success("Rejection transaction sent!");
    } catch { toast.error("Failed"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-pri mb-2">Governance Panel</h1>
      <p className="text-text-sec font-body mb-6">Review and approve/reject vulnerability reports.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card variant="solid"><div className="text-2xl font-heading font-bold text-orange">{reports.length}</div><div className="text-xs text-text-sec font-body">Pending Reports</div></Card>
        <Card variant="solid"><div className="text-2xl font-heading font-bold text-green">—</div><div className="text-xs text-text-sec font-body">Approved Today</div></Card>
        <Card variant="solid"><div className="text-2xl font-heading font-bold text-blue">—</div><div className="text-xs text-text-sec font-body">Avg Response (hrs)</div></Card>
      </div>

      {/* Reports Queue */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">⚖️</div>
            <h3 className="font-heading font-semibold text-text-pri">No pending reports</h3>
            <p className="text-text-sec font-body text-sm">All reports have been reviewed.</p>
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.onChainReportId} className="border border-border-clr rounded-card overflow-hidden">
              <div
                onClick={() => setExpandedId(expandedId === r.onChainReportId ? null : r.onChainReportId)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-bg-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={r.severity?.toLowerCase()} size="sm">{r.severity}</Badge>
                  <span className="font-heading font-semibold text-sm">{r.title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-sec font-body">
                  <span>{formatETH(r.payout)} ETH</span>
                  <span>{timeAgo(r.submittedAt)}</span>
                  <span>{expandedId === r.onChainReportId ? "▲" : "▼"}</span>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === r.onChainReportId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-border-clr bg-bg-light space-y-4">
                      <p className="text-sm font-body text-text-sec whitespace-pre-wrap">{r.description}</p>
                      <a href={`https://gateway.pinata.cloud/ipfs/${r.ipfsHash}`} target="_blank" className="text-orange text-sm font-body">📎 View Evidence on IPFS</a>
                      <Input placeholder="Reason for approval/rejection..." value={reason} onChange={(e) => setReason(e.target.value)} />
                      <div className="flex gap-3">
                        <Button variant="primary" onClick={() => handleApprove(r.onChainReportId)} loading={isPending} className="bg-green hover:shadow-[0_0_40px_rgba(34,197,94,0.55)]">
                          ✓ Approve
                        </Button>
                        <Button variant="outline" onClick={() => handleReject(r.onChainReportId)} loading={isPending} className="border-red-400 text-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.55)]">
                          ✗ Reject
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
