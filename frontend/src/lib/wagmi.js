import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hardhat } from "wagmi/chains";
import { http } from "wagmi";

const ganache = {
  id: 5777,
  name: "Ganache",
  network: "ganache",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:7545"] }, public: { http: ["http://127.0.0.1:7545"] } },
};

const config = getDefaultConfig({
  appName: "DecentraBounty",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [sepolia, ganache],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC),
    [ganache.id]: http("http://127.0.0.1:7545"),
  },
  ssr: true,
});

export default config;
