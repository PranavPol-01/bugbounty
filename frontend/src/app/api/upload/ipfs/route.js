import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const name = formData.get("name") || "bug-report";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // In production with real Pinata JWT:
    // const pinata = new PinataClient({ pinataJWTKey: process.env.PINATA_JWT });
    // const result = await pinata.pinFileToIPFS(readableStream, { pinataMetadata: { name } });

    const mockHash = `Qm${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    
    return NextResponse.json({
      ipfsHash: mockHash,
      url: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
      message: "Configure PINATA_JWT env var for real IPFS pinning"
    });
  } catch (error) {
    return NextResponse.json({ error: "IPFS upload failed" }, { status: 500 });
  }
}
