"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useVaultWrite } from "@/hooks/useVault";
import toast from "react-hot-toast";

export default function FundVaultModal({ isOpen, onClose, vaultId }) {
  const [amount, setAmount] = useState("");
  const { fundVault, isPending, isConfirming, isSuccess } = useVaultWrite();

  const handleFund = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    fundVault(vaultId, "0", amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fund Vault">
      <div className="space-y-4">
        <Input
          label="Amount (ETH)"
          placeholder="0.5"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={handleFund} loading={isPending || isConfirming} className="w-full">
          {isPending ? "Confirm..." : isConfirming ? "Sending..." : isSuccess ? "✓ Funded!" : "Fund Vault"}
        </Button>
        {isSuccess && <p className="text-green font-body text-sm text-center">Vault funded with {amount} ETH!</p>}
      </div>
    </Modal>
  );
}
