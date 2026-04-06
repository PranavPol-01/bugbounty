import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    if (!address) return NextResponse.json({ error: "address query param required" }, { status: 400 });

    const notifications = await Notification.find({
      recipientAddress: address.toLowerCase(),
    }).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Notification GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
