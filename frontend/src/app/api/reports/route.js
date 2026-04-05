import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import Notification from "@/models/Notification";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const filter = {};
    if (searchParams.get("status")) filter.status = searchParams.get("status");
    if (searchParams.get("severity")) filter.severity = searchParams.get("severity");
    if (searchParams.get("vaultId")) filter.vaultId = Number(searchParams.get("vaultId"));
    if (searchParams.get("researcher")) filter.researcher = searchParams.get("researcher").toLowerCase();

    const reports = await Report.find(filter).sort({ submittedAt: -1 }).limit(100);
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await request.json();

    const report = await Report.create({
      ...body,
      researcher: decoded.address,
    });

    await Notification.create({
      recipientAddress: decoded.address,
      type: "REPORT_SUBMITTED",
      message: `Your report "${body.title}" has been submitted.`,
      reportId: body.onChainReportId,
      vaultId: body.vaultId,
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
