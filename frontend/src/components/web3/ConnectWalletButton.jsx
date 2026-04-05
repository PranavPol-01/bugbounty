"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectWalletButton({ className = "" }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openChainModal, openAccountModal, mounted }) => {
        const connected = mounted && account && chain;
        return (
          <div className={className}>
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="px-6 py-3 bg-orange text-white font-heading font-semibold rounded-btn hover:shadow-glow transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
              >
                Connect Wallet
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={openChainModal}
                className="px-6 py-3 bg-red-500 text-white font-heading font-semibold rounded-btn"
              >
                Wrong Network
              </button>
            ) : (
              <button
                onClick={openAccountModal}
                className="flex items-center gap-2 px-4 py-2 glass-card text-white font-body text-sm rounded-btn hover:shadow-glow transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-green" />
                <span>{account.displayName}</span>
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
