"use client";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { BUG_BOUNTY_VAULT_ABI, VAULT_ADDRESS, REPUTATION_NFT_ABI, NFT_ADDRESS } from "@/lib/contractABI";

export function useReputation() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mintNFT = (reportId, tokenURI) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: BUG_BOUNTY_VAULT_ABI,
      functionName: "mintReputationNFT",
      args: [BigInt(reportId), tokenURI],
    });
  };

  return { mintNFT, hash, isPending, isConfirming, isSuccess, error };
}

export function useNFTBalance(address) {
  return useReadContract({
    address: NFT_ADDRESS,
    abi: REPUTATION_NFT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
  });
}

export function useNFTTotalSupply() {
  return useReadContract({
    address: NFT_ADDRESS,
    abi: REPUTATION_NFT_ABI,
    functionName: "totalSupply",
  });
}
