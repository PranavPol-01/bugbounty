import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { reportId } = await params;
    const report = await Report.findOne({ onChainReportId: Number(reportId) });
    if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}
