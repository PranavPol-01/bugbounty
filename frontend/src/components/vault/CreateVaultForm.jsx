"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { isAddress, decodeEventLog } from "viem";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useVaultWrite } from "@/hooks/useVault";
import { createVaultRecord } from "@/lib/api";
import { BUG_BOUNTY_VAULT_ABI } from "@/lib/contractABI";
import toast from "react-hot-toast";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function CreateVaultForm() {
  const [step, setStep] = useState(1);
  const { address } = useAccount();
  const { createVault, isPending, isConfirming, isSuccess, receipt, hash } = useVaultWrite();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", websiteUrl: "", governanceAuthority: "",
    rewardToken: ZERO_ADDRESS, critical: "", high: "", medium: "", low: "", fundAmount: "",
  });

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleDeploy = async () => {
    try {
      setSaved(false);
      createVault(
        form.governanceAuthority,
        form.rewardToken,
        form.critical, form.high, form.medium, form.low,
        form.fundAmount
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Save vault to MongoDB after on-chain tx confirms ──────────────────
  useEffect(() => {
    if (!isSuccess || !receipt || saved) return;

    async function saveVaultToDB() {
      try {
        // Parse the VaultCreated event from the tx receipt logs to get the real on-chain vaultId
        let onChainVaultId = null;
        for (const log of receipt.logs) {
          try {
            const decoded = decodeEventLog({
              abi: BUG_BOUNTY_VAULT_ABI,
              data: log.data,
              topics: log.topics,
              eventName: "VaultCreated",
            });
            if (decoded?.args?.vaultId !== undefined) {
              onChainVaultId = Number(decoded.args.vaultId);
              break;
            }
          } catch {
            // This log doesn't match VaultCreated — try next
          }
        }

        if (onChainVaultId === null) {
          toast.error("Vault deployed but could not read vault ID from chain.");
          return;
        }

        await createVaultRecord({
          onChainVaultId,
          programTeam: address,
          governanceAuthority: form.governanceAuthority,
          rewardToken: form.rewardToken,
          name: form.name,
          description: form.description,
          websiteUrl: form.websiteUrl,
          rewards: {
            critical: form.critical,
            high: form.high,
            medium: form.medium,
            low: form.low,
          },
          totalFunded: form.fundAmount || "0",
          active: true,
        });

        setSaved(true);
        toast.success(`Vault #${onChainVaultId} saved to database!`);
      } catch (err) {
        console.error("DB save error:", err);
        toast.error("Vault deployed on-chain, but DB save failed: " + err.message);
      }
    }

    saveVaultToDB();
  }, [isSuccess, receipt, saved]);

  const steps = [
    { num: 1, label: "Vault Info" },
    { num: 2, label: "Rewards" },
    { num: 3, label: "Deploy" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm ${step >= s.num ? "bg-gradient-to-br from-orange to-purple text-white" : "bg-gray-200 text-text-sec"}`}>
              {s.num}
            </div>
            <span className={`text-sm font-body ${step >= s.num ? "text-text-pri" : "text-text-sec"}`}>{s.label}</span>
            {i < 2 && <div className={`w-12 h-0.5 ${step > s.num ? "bg-orange" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="space-y-4">
            <Input label="Project Name *" placeholder="e.g. My DeFi Protocol" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <div className="space-y-1.5">
              <label className="block text-sm font-body font-medium text-text-pri">Description</label>
              <textarea
                placeholder="Describe your project and bounty scope..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                maxLength={500}
                className="w-full px-4 py-3 rounded-btn border border-border-clr font-body text-sm focus:outline-2 focus:outline-orange resize-none h-28"
              />
              <p className="text-xs text-text-sec text-right">{form.description.length}/500</p>
            </div>
            <Input label="Website URL" placeholder="https://example.com" value={form.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} />
            <Input
              label="Governance Authority Address *"
              placeholder="0x..."
              value={form.governanceAuthority}
              onChange={(e) => update("governanceAuthority", e.target.value)}
              error={form.governanceAuthority && !isAddress(form.governanceAuthority) ? "Invalid address" : ""}
              rightElement={form.governanceAuthority && isAddress(form.governanceAuthority) ? <span className="text-green">✓</span> : null}
            />
            <Button onClick={() => setStep(2)} disabled={!form.name || !form.governanceAuthority || !isAddress(form.governanceAuthority)}>Next →</Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="space-y-4">
            <p className="text-sm font-body text-text-sec mb-2">Set reward amounts (in ETH). Must be Critical ≥ High ≥ Medium ≥ Low.</p>
            <Input label="Critical Reward (ETH) *" placeholder="0.4" type="number" step="0.01" value={form.critical} onChange={(e) => update("critical", e.target.value)} />
            <Input label="High Reward (ETH) *" placeholder="0.2" type="number" step="0.01" value={form.high} onChange={(e) => update("high", e.target.value)} />
            <Input label="Medium Reward (ETH) *" placeholder="0.1" type="number" step="0.01" value={form.medium} onChange={(e) => update("medium", e.target.value)} />
            <Input label="Low Reward (ETH) *" placeholder="0.05" type="number" step="0.01" value={form.low} onChange={(e) => update("low", e.target.value)} />
            <Input label="Initial Funding (ETH)" placeholder="2.0" type="number" step="0.01" value={form.fundAmount} onChange={(e) => update("fundAmount", e.target.value)} />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
              <Button onClick={() => setStep(3)} disabled={!form.critical || !form.high || !form.medium || !form.low}>Review →</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="space-y-6">
            <div className="bg-bg-light rounded-card p-6 space-y-3 border border-border-clr">
              <h3 className="font-heading font-semibold mb-3">Review Your Vault</h3>
              <div className="grid grid-cols-2 gap-3 text-sm font-body">
                <span className="text-text-sec">Name:</span><span className="text-text-pri font-medium">{form.name}</span>
                <span className="text-text-sec">Governance:</span><span className="text-text-pri font-medium">{form.governanceAuthority?.slice(0, 10)}...</span>
                <span className="text-text-sec">Critical:</span><span className="text-orange font-medium">{form.critical} ETH</span>
                <span className="text-text-sec">High:</span><span className="text-orange font-medium">{form.high} ETH</span>
                <span className="text-text-sec">Medium:</span><span className="text-orange font-medium">{form.medium} ETH</span>
                <span className="text-text-sec">Low:</span><span className="text-orange font-medium">{form.low} ETH</span>
                <span className="text-text-sec">Funding:</span><span className="text-purple font-medium">{form.fundAmount || "0"} ETH</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
              <Button onClick={handleDeploy} loading={isPending || isConfirming} disabled={isSuccess && saved}>
                {isPending ? "Confirm in Wallet..." : isConfirming ? "Deploying..." : (isSuccess && saved) ? "✓ Vault Created & Saved!" : isSuccess ? "Saving to DB..." : "Deploy Vault"}
              </Button>
            </div>
            {isSuccess && hash && (
              <p className="text-green font-body text-sm">
                Transaction confirmed! Tx: {hash?.slice(0, 16)}...
                {saved && " • Saved to database ✓"}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
