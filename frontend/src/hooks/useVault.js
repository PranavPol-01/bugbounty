"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { BUG_BOUNTY_VAULT_ABI, VAULT_ADDRESS } from "@/lib/contractABI";

export function useVaultRead(functionName, args = []) {
  return useReadContract({
    address: VAULT_ADDRESS,
    abi: BUG_BOUNTY_VAULT_ABI,
    functionName,
    args,
  });
}

export function useVaultWrite() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });

  const createVault = (governanceAuthority, rewardToken, critical, high, medium, low, ethValue) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: BUG_BOUNTY_VAULT_ABI,
      functionName: "createVault",
      args: [governanceAuthority, rewardToken, parseEther(critical), parseEther(high), parseEther(medium), parseEther(low)],
      value: ethValue ? parseEther(ethValue) : 0n,
    });
  };

  const fundVault = (vaultId, tokenAmount, ethValue) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: BUG_BOUNTY_VAULT_ABI,
      functionName: "fundVault",
      args: [BigInt(vaultId), tokenAmount ? parseEther(tokenAmount) : 0n],
      value: ethValue ? parseEther(ethValue) : 0n,
    });
  };

  const toggleVault = (vaultId) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: BUG_BOUNTY_VAULT_ABI,
      functionName: "toggleVault",
      args: [BigInt(vaultId)],
    });
  };

  return { createVault, fundVault, toggleVault, hash, isPending, isConfirming, isSuccess, receipt, error };
}

