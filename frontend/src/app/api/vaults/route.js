import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Vault from "@/models/Vault";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const filter = {};
    if (searchParams.get("active")) filter.active = searchParams.get("active") === "true";
    if (searchParams.get("programTeam")) filter.programTeam = searchParams.get("programTeam").toLowerCase();

    const vaults = await Vault.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(vaults);
  } catch (error) {
    console.error("Vault GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch vaults: " + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await request.json();

    const vault = await Vault.create({
      ...body,
      programTeam: decoded.address,
    });

    return NextResponse.json(vault, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vault" }, { status: 500 });
  }
}
