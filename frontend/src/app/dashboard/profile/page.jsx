"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import NFTGallery from "@/components/nft/NFTGallery";
import ReportList from "@/components/report/ReportList";
import { getUserProfile, updateProfile, getReports } from "@/lib/api";
import { truncateAddress, formatETH } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { address } = useAccount();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", bio: "", twitterHandle: "" });

  useEffect(() => {
    if (address) {
      getUserProfile(address).then((u) => { setUser(u); setForm({ username: u.username, bio: u.bio, twitterHandle: u.twitterHandle }); }).catch(() => {});
      getReports(`researcher=${address}`).then(setReports).catch(() => []);
    }
  }, [address]);

  const handleSave = async () => {
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header */}
      <Card variant="solid" className="mb-8">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange to-purple flex items-center justify-center text-white font-heading font-bold text-2xl shrink-0">
            {(user?.username || address || "?")[0].toUpperCase()}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                <Input label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                <Input label="Twitter" value={form.twitterHandle} onChange={(e) => setForm({ ...form, twitterHandle: e.target.value })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-heading font-bold text-text-pri">{user?.username || truncateAddress(address)}</h2>
                <p className="text-text-sec font-body text-sm">{address}</p>
                {user?.bio && <p className="text-text-sec font-body text-sm mt-2">{user.bio}</p>}
                {user?.twitterHandle && <p className="text-blue font-body text-sm">@{user.twitterHandle}</p>}
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setEditing(true)}>Edit Profile</Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Earned", value: `${formatETH(user?.totalEarned)} ETH`, icon: "💰" },
          { label: "Approved", value: user?.approvedReports || 0, icon: "✅" },
          { label: "NFTs", value: user?.nftCount || 0, icon: "🏅" },
          { label: "Reports", value: reports.length, icon: "📄" },
        ].map((s, i) => (
          <Card key={i} variant="solid" padding="sm">
            <div className="text-xl">{s.icon}</div>
            <div className="text-lg font-heading font-bold text-text-pri">{s.value}</div>
            <div className="text-xs text-text-sec font-body">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* NFT Gallery */}
      <div className="mb-8">
        <h2 className="text-lg font-heading font-semibold text-text-pri mb-4">My Reputation NFTs</h2>
        <NFTGallery nfts={[]} />
      </div>

      {/* Report History */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-text-pri mb-4">Report History</h2>
        <ReportList reports={reports} />
      </div>
    </div>
  );
}
