"use client";
import { motion } from "framer-motion";

const features = [
  { icon: "🔒", title: "Trustless Escrow", desc: "Funds locked in smart contracts. No middlemen, no trust required." },
  { icon: "⟠", title: "ETH + ERC20", desc: "Support for native ETH and any ERC20 token as bounty rewards." },
  { icon: "🏅", title: "NFT Reputation", desc: "Earn verifiable on-chain reputation NFTs for every paid report." },
  { icon: "⚖️", title: "On-chain Governance", desc: "Transparent approval and rejection with immutable audit trails." },
  { icon: "📦", title: "IPFS Evidence", desc: "Report documents stored permanently on IPFS for tamper-proof records." },
  { icon: "💎", title: "Multi-severity Rewards", desc: "Tiered payouts from Low to Critical based on vulnerability impact." },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-text-pri mb-4" style={{ fontSize: "clamp(28px, 4vw, 36px)" }}>
            Built for <span className="gradient-text">Security</span>
          </h2>
          <p className="text-text-sec font-body max-w-2xl mx-auto">
            Everything you need for a transparent, trustless bug bounty program.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-card-light p-6 glow-orange cursor-default"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-heading font-semibold text-text-pri mb-2">{f.title}</h3>
              <p className="text-text-sec font-body text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
