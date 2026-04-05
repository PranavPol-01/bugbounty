import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    jwt.verify(token, process.env.JWT_SECRET);
    const { reportId } = await params;
    const { status, governanceNote, nftMinted, nftTokenId } = await request.json();

    const report = await Report.findOneAndUpdate(
      { onChainReportId: Number(reportId) },
      { status, governanceNote, nftMinted, nftTokenId, resolvedAt: new Date() },
      { new: true }
    );

    if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
