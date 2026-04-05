import { formatEther } from "viem";

export function truncateAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatETH(value) {
  if (!value) return "0";
  try {
    const formatted = formatEther(BigInt(value));
    return parseFloat(formatted).toFixed(4);
  } catch {
    return "0";
  }
}

export function timeAgo(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export const SEVERITY_LABELS = ["Low", "Medium", "High", "Critical"];
export const SEVERITY_COLORS = {
  Low: "#22C55E",
  Medium: "#F59E0B",
  High: "#FF6A00",
  Critical: "#EF4444",
  0: "#22C55E",
  1: "#F59E0B",
  2: "#FF6A00",
  3: "#EF4444",
};

export const STATUS_LABELS = ["Pending", "Approved", "Rejected", "Paid"];
export const STATUS_COLORS = {
  Pending: "#3B82F6",
  Approved: "#22C55E",
  Rejected: "#EF4444",
  Paid: "#7B3FF2",
  0: "#3B82F6",
  1: "#22C55E",
  2: "#EF4444",
  3: "#7B3FF2",
};

export function severityFromIndex(i) {
  return SEVERITY_LABELS[i] || "Unknown";
}

export function statusFromIndex(i) {
  return STATUS_LABELS[i] || "Unknown";
}

export function generateBlockie(address) {
  // Simple deterministic color from address for placeholder avatar
  if (!address) return "#FF6A00";
  const hash = address.toLowerCase().replace("0x", "");
  const r = parseInt(hash.substring(0, 2), 16);
  const g = parseInt(hash.substring(2, 4), 16);
  const b = parseInt(hash.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}
