"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getReport } from "@/lib/api";
import { formatETH, timeAgo, truncateAddress } from "@/lib/utils";
import { useReportWrite } from "@/hooks/useReport";
import { useReputation } from "@/hooks/useReputation";
import toast from "react-hot-toast";

const statusBannerColors = { Pending: "bg-blue", Approved: "bg-green", Rejected: "bg-red-500", Paid: "bg-purple" };

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const { address } = useAccount();
  const [report, setReport] = useState(null);
  const { executePayout, isPending: payoutPending, isSuccess: payoutSuccess } = useReportWrite();
  const { mintNFT, isPending: mintPending, isSuccess: mintSuccess } = useReputation();

  useEffect(() => {
    getReport(reportId).then(setReport).catch(() => {});
  }, [reportId]);

  if (!report) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-orange border-t-transparent rounded-full" /></div>;

  const isResearcher = report.researcher === address?.toLowerCase();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Status Banner */}
      <div className={`${statusBannerColors[report.status] || "bg-blue"} h-2 rounded-full mb-6`} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={report.severity?.toLowerCase()}>{report.severity}</Badge>
          <Badge variant={report.status?.toLowerCase()}>{report.status}</Badge>
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-pri mb-2">{report.title}</h1>
        <p className="text-text-sec font-body text-sm">
          Vault #{report.vaultId} · Submitted {timeAgo(report.submittedAt)} · by {truncateAddress(report.researcher)}
        </p>
      </div>

      {/* Description */}
      <Card variant="solid" className="mb-6">
        <h3 className="font-heading font-semibold text-sm mb-2">Description</h3>
        <p className="text-text-sec font-body text-sm whitespace-pre-wrap">{report.description}</p>
      </Card>

      {/* Evidence */}
      <Card variant="solid" className="mb-6">
        <h3 className="font-heading font-semibold text-sm mb-2">Evidence</h3>
        <a href={`https://gateway.pinata.cloud/ipfs/${report.ipfsHash}`} target="_blank" rel="noopener noreferrer"
          className="text-orange font-body text-sm hover:underline">📎 Open Report on IPFS →</a>
      </Card>

      {/* Governance Note */}
      {report.governanceNote && (
        <Card variant="solid" className="mb-6 bg-gray-50">
          <h3 className="font-heading font-semibold text-sm mb-2">Governance Note</h3>
          <p className="text-text-sec font-body text-sm">{report.governanceNote}</p>
          {report.resolvedAt && <p className="text-xs text-text-sec mt-2">Resolved {timeAgo(report.resolvedAt)}</p>}
        </Card>
      )}

      {/* Payout */}
      <Card variant="solid" className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-sec font-body text-sm">Payout Amount</p>
            <p className="text-2xl font-heading font-bold text-orange">{formatETH(report.payout)} ETH</p>
          </div>
          {report.status === "Approved" && isResearcher && (
            <Button onClick={() => executePayout(reportId)} loading={payoutPending}>
              {payoutSuccess ? "✓ Claimed!" : "Claim Payout"}
            </Button>
          )}
          {report.status === "Paid" && !report.nftMinted && isResearcher && (
            <Button variant="secondary" onClick={() => mintNFT(reportId, `ipfs://report-${reportId}-nft`)} loading={mintPending}>
              {mintSuccess ? "✓ Minted!" : "Mint NFT"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
