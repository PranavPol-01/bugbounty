"use client";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BUG_BOUNTY_VAULT_ABI, VAULT_ADDRESS } from "@/lib/contractABI";

export function useReportWrite() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const submitReport = (vaultId, severity, ipfsHash) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: BUG_BOUNTY_VAULT_ABI,
      functionName: "submitReport",
      args: [BigInt(vaultId), severity, ipfsHash],
    });
  };

  const approveReport = (reportId, reason) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: BUG_BOUNTY_VAULT_ABI,
      functionName: "approveReport",
      args: [BigInt(reportId), reason],
    });
  };

  const rejectReport = (reportId, reason) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: BUG_BOUNTY_VAULT_ABI,
      functionName: "rejectReport",
      args: [BigInt(reportId), reason],
    });
  };

  const executePayout = (reportId) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: BUG_BOUNTY_VAULT_ABI,
      functionName: "executePayout",
      args: [BigInt(reportId)],
    });
  };

  return { submitReport, approveReport, rejectReport, executePayout, hash, isPending, isConfirming, isSuccess, error };
}
