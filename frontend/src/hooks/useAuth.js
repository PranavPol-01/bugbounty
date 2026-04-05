"use client";
import { useState, useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { authUser as authUserAPI } from "@/lib/api";

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const login = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const nonce = crypto.randomUUID();
      const message = `Sign in to DecentraBounty with your wallet.\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
      const signature = await signMessageAsync({ message });
      const data = await authUserAPI({ address, signature, message });
      localStorage.setItem("db_token", data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, signMessageAsync]);

  const logout = useCallback(() => {
    localStorage.removeItem("db_token");
    setUser(null);
  }, []);

  const isAuthenticated = typeof window !== "undefined" && !!localStorage.getItem("db_token");

  return { login, logout, user, isLoading, error, isConnected, address, isAuthenticated };
}
