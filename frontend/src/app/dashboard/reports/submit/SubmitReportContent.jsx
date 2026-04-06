"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useReportWrite } from "@/hooks/useReport";
import { getVaults, createReportRecord } from "@/lib/api";
import { formatETH, SEVERITY_LABELS, SEVERITY_COLORS } from "@/lib/utils";
import { BUG_BOUNTY_VAULT_ABI } from "@/lib/contractABI";
import { decodeEventLog } from "viem";
import toast from "react-hot-toast";

export default function SubmitReportContent() {
  const searchParams = useSearchParams();
  const preVaultId = searchParams.get("vaultId");
  const { address } = useAccount();
  const { submitReport, isPending, isConfirming, isSuccess, receipt, hash } = useReportWrite();

  const [vaults, setVaults] = useState([]);
  const [form, setForm] = useState({
    vaultId: preVaultId || "",
    severity: null,
    title: "",
    description: "",
    ipfsHash: "QmPlaceholderHash",
  });

  useEffect(() => {
    getVaults("active=true").then(setVaults).catch(() => []);
  }, []);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const selectedVault = vaults.find((v) => String(v.onChainVaultId) === String(form.vaultId));

  const handleSubmit = async () => {
    if (form.severity === null || !form.vaultId || !form.title) {
      toast.error("Fill all required fields");
      return;
    }
    if (!form.description) {
      toast.error("Description is required");
      return;
    }
    if (form.ipfsHash === "QmPlaceholderHash" || !form.ipfsHash) {
      toast.error("Please upload your evidence to IPFS and paste the real hash");
      return;
    }
    try {
      submitReport(form.vaultId, form.severity, form.ipfsHash);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!isSuccess || !receipt) return;

    async function saveReportToDB() {
      try {
        // Parse the ReportSubmitted event from the tx receipt to get the real on-chain reportId
        let onChainReportId = null;
        for (const log of receipt.logs) {
          try {
            const decoded = decodeEventLog({
              abi: BUG_BOUNTY_VAULT_ABI,
              data: log.data,
              topics: log.topics,
              eventName: "ReportSubmitted",
            });
            if (decoded?.args?.reportId !== undefined) {
              onChainReportId = Number(decoded.args.reportId);
              break;
            }
          } catch {
            // This log doesn't match ReportSubmitted — try next
          }
        }

        if (onChainReportId === null) {
          toast.error("Report submitted on-chain, but could not read report ID from chain.");
          return;
        }

        toast.success("Report submitted on-chain!");

        await createReportRecord({
          onChainReportId,
          vaultId: Number(form.vaultId),
          researcher: address,
          severity: SEVERITY_LABELS[form.severity],
          title: form.title,
          description: form.description,
          ipfsHash: form.ipfsHash,
        });

        toast.success(`Report #${onChainReportId} saved to database!`);
      } catch (err) {
        console.error("DB save error:", err);
        toast.error("Report on-chain, but DB save failed: " + err.message);
      }
    }

    saveReportToDB();
  }, [isSuccess, receipt]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-text-pri mb-2">Submit a Report</h1>
      <p className="text-text-sec font-body mb-8">Submit a vulnerability report to a bounty vault.</p>

      <div className="space-y-6">
        {/* Vault Selector */}
        <div>
          <label className="block text-sm font-body font-medium text-text-pri mb-2">Select Vault *</label>
          <select
            value={form.vaultId}
            onChange={(e) => update("vaultId", e.target.value)}
            className="w-full px-4 py-3 rounded-btn border border-border-clr font-body text-sm focus:outline-2 focus:outline-orange bg-white"
          >
            <option value="">Choose a vault...</option>
            {vaults.map((v) => (
              <option key={v.onChainVaultId} value={v.onChainVaultId}>
                {v.name} (#{v.onChainVaultId})
              </option>
            ))}
          </select>
        </div>

        {/* Severity Selector */}
        <div>
          <label className="block text-sm font-body font-medium text-text-pri mb-2">Severity *</label>
          <div className="grid grid-cols-2 gap-3">
            {SEVERITY_LABELS.map((sev, i) => (
              <motion.div
                key={sev}
                whileTap={{ scale: 0.97 }}
                onClick={() => update("severity", i)}
                className={`p-4 rounded-card border-2 cursor-pointer transition-all ${
                  form.severity === i
                    ? "border-orange shadow-glow bg-orange/5"
                    : "border-border-clr hover:border-orange/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ background: SEVERITY_COLORS[i] }} />
                  <span className="font-heading font-semibold text-sm">{sev}</span>
                </div>
                {selectedVault && (
                <p className="text-xs text-text-sec font-body">
                    Reward: {parseFloat(selectedVault.rewards?.[sev.toLowerCase()] || 0).toFixed(4)} ETH
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <Input label="Title *" placeholder="Brief vulnerability description" value={form.title} onChange={(e) => update("title", e.target.value)} />

        <div>
          <label className="block text-sm font-body font-medium text-text-pri mb-1.5">Description *</label>
          <textarea
            placeholder="Detailed vulnerability description..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full px-4 py-3 rounded-btn border border-border-clr font-body text-sm focus:outline-2 focus:outline-orange resize-none h-32"
          />
        </div>

        <Input label="IPFS Hash" value={form.ipfsHash} onChange={(e) => update("ipfsHash", e.target.value)} helperText="Upload evidence to IPFS first, then paste the hash here." />

        <Button onClick={handleSubmit} loading={isPending || isConfirming} className="w-full" size="lg">
          {isPending ? "Confirm in Wallet..." : isConfirming ? "Submitting..." : isSuccess ? "✓ Report Submitted!" : "Submit Report"}
        </Button>
      </div>
    </div>
  );
}
