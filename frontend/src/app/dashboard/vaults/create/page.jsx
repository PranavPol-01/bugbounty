"use client";
import CreateVaultForm from "@/components/vault/CreateVaultForm";

export default function CreateVaultPage() {
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-pri mb-2">Create a Bounty Vault</h1>
      <p className="text-text-sec font-body mb-8">Deploy a new bug bounty program with on-chain escrow.</p>
      <CreateVaultForm />
    </div>
  );
}
