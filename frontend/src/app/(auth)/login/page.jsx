"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ConnectWalletButton from "@/components/web3/ConnectWalletButton";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const { isConnected } = useAccount();
  const [shake, setShake] = useState(false);

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="orb w-72 h-72 bg-orange top-20 left-20" />
      <div className="orb w-96 h-96 bg-purple bottom-10 right-10" style={{ animationDelay: "2s" }} />

      <motion.div
        animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange to-purple flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-white font-bold text-2xl">DB</span>
          </motion.div>
          <h1 className="text-2xl font-heading font-bold text-white mb-2">Connect Your Wallet</h1>
          <p className="text-gray-400 font-body text-sm">
            Sign in with Ethereum to access the DecentraBounty dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <ConnectWalletButton />
          </div>

          {isConnected && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button onClick={handleLogin} loading={isLoading} className="w-full" variant="secondary">
                Sign Message & Login
              </Button>
            </motion.div>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center font-body">{error}</p>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-8 font-body">
          By connecting, you agree to sign a message to verify wallet ownership. No gas fees required.
        </p>
      </motion.div>
    </div>
  );
}
