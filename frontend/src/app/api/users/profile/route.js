import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PUT(request) {
  try {
    await connectDB();
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { bio, username, avatarUrl, twitterHandle } = await request.json();

    const user = await User.findOneAndUpdate(
      { address: decoded.address },
      { bio, username, avatarUrl, twitterHandle },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
