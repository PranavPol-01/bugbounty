"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import VaultList from "@/components/vault/VaultList";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getVaults } from "@/lib/api";

const filters = ["All", "Active", "Paused"];

export default function VaultsPage() {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    getVaults().then(setVaults).catch(() => setVaults([])).finally(() => setLoading(false));
  }, []);

  const filteredVaults = vaults.filter((v) => {
    if (activeFilter === "Active" && !v.active) return false;
    if (activeFilter === "Paused" && v.active) return false;
    if (search && !v.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-pri">All Vaults</h1>
        <Link href="/dashboard/vaults/create"><Button>Create Vault</Button></Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input placeholder="Search vaults..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-pill text-sm font-body transition-all ${activeFilter === f ? "bg-orange text-white" : "bg-gray-100 text-text-sec hover:bg-gray-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <VaultList vaults={filteredVaults} loading={loading} />
    </div>
  );
}
