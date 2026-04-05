"use client";
import { AnimatePresence, motion } from "framer-motion";
import ReportCard from "./ReportCard";

export default function ReportList({ reports = [], loading = false }) {
  if (loading) {
    return <div className="space-y-3">{[...Array(5)].map((_, i) => (<div key={i} className="bg-gray-100 rounded-card h-20 animate-pulse" />))}</div>;
  }
  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📄</div>
        <h3 className="font-heading font-semibold text-text-pri mb-1">No reports found</h3>
        <p className="text-text-sec font-body text-sm">Submit your first vulnerability report to get started.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {reports.map((r) => (
          <motion.div key={r.onChainReportId || r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReportCard report={r} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
