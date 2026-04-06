import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PUT(request) {
  try {
    await connectDB();
    const { address, bio, username, avatarUrl, twitterHandle } = await request.json();
    if (!address) return NextResponse.json({ error: "address required" }, { status: 400 });

    const user = await User.findOneAndUpdate(
      { address: address.toLowerCase() },
      { bio, username, avatarUrl, twitterHandle },
      { new: true, upsert: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json({ error: "Update failed: " + error.message }, { status: 500 });
  }
}
