import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

export async function POST(request) {
  try {
    await connectDB();
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await Notification.updateMany(
      { recipientAddress: decoded.address, read: false },
      { read: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark read" }, { status: 500 });
  }
}
