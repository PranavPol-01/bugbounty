import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Simplified auth: just find-or-create user by wallet address, no signature verification
export async function POST(request) {
  try {
    await connectDB();
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: "address required" }, { status: 400 });
    }

    let user = await User.findOne({ address: address.toLowerCase() });
    if (!user) {
      user = await User.create({ address: address.toLowerCase() });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed: " + error.message }, { status: 500 });
  }
}
