"use client";
import { Suspense } from "react";
import SubmitReportContent from "./SubmitReportContent";

export default function SubmitReportPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-orange border-t-transparent rounded-full" /></div>}>
      <SubmitReportContent />
    </Suspense>
  );
}
