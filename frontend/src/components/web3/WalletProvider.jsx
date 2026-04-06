"use client";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import config from "@/lib/wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";

export default function WalletProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#FF6A00",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          {children}
          {typeof window !== 'undefined' && console.log("VAULT_ADDRESS", process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS)}
          {typeof window !== 'undefined' && console.log("NFT_ADDRESS", process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS)}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
