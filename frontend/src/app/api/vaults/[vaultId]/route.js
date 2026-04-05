import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vault from "@/models/Vault";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { vaultId } = await params;
    const vault = await Vault.findOne({ onChainVaultId: Number(vaultId) });
    if (!vault) return NextResponse.json({ error: "Vault not found" }, { status: 404 });
    return NextResponse.json(vault);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vault" }, { status: 500 });
  }
}
