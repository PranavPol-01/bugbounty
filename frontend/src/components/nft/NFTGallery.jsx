"use client";
import NFTCard from "./NFTCard";

export default function NFTGallery({ nfts = [] }) {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🏅</div>
        <h3 className="font-heading font-semibold text-text-pri mb-1">No NFTs yet</h3>
        <p className="text-text-sec font-body text-sm">Submit reports to earn reputation NFTs.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {nfts.map((nft, i) => <NFTCard key={i} nft={nft} />)}
    </div>
  );
}
