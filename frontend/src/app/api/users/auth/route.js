import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyMessage } from "viem";

export async function POST(request) {
  try {
    await connectDB();
    const { address, signature, message } = await request.json();

    if (!address || !signature || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify the SIWE signature
    let recovered;
    try {
      const isValid = await verifyMessage({ address, message, signature });
      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
      recovered = address;
    } catch {
      return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
    }

    // Find or create user
    let user = await User.findOne({ address: address.toLowerCase() });
    if (!user) {
      user = await User.create({ address: address.toLowerCase() });
    }

    const token = jwt.sign(
      { address: user.address, id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token, user });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
