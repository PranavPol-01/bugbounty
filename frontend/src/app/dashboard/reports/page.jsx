"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import ReportList from "@/components/report/ReportList";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getReports } from "@/lib/api";

export default function ReportsPage() {
  const { address } = useAccount();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (address) {
      getReports(`researcher=${address}`).then(setReports).catch(() => []).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [address]);

  const filtered = statusFilter === "All" ? reports : reports.filter((r) => r.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-pri">My Reports</h1>
          <p className="text-text-sec font-body text-sm">{reports.length} total reports</p>
        </div>
        <Link href="/dashboard/reports/submit"><Button>Submit Report</Button></Link>
      </div>

      <div className="flex gap-2 mb-6">
        {["All", "Pending", "Approved", "Rejected", "Paid"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-pill text-sm font-body ${statusFilter === s ? "bg-orange text-white" : "bg-gray-100 text-text-sec hover:bg-gray-200"}`}>
            {s}
          </button>
        ))}
      </div>

      <ReportList reports={filtered} loading={loading} />
    </div>
  );
}
