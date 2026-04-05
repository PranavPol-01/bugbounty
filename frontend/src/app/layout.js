import "./globals.css";
import WalletProvider from "@/components/web3/WalletProvider";
import ToastProvider from "@/components/ui/Toast";

export const metadata = {
  title: "DecentraBounty — Decentralized Bug Bounty Platform",
  description: "Trust-minimized bug bounty escrow with NFT reputation, real-time dashboards, and on-chain governance. Built on Ethereum.",
  keywords: ["bug bounty", "ethereum", "web3", "smart contracts", "security", "NFT"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <WalletProvider>
          {children}
          <ToastProvider />
        </WalletProvider>
      </body>
    </html>
  );
}
