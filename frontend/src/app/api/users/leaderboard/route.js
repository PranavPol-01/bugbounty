import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({})
      .sort({ totalEarned: -1, approvedReports: -1 })
      .limit(50)
      .select("address username avatarUrl totalEarned approvedReports nftCount");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
