"use client";
import { motion } from "framer-motion";

const steps = [
  { num: 1, title: "Create Vault", desc: "Project teams deploy bounty vaults with ETH or ERC20 rewards and assign governance." },
  { num: 2, title: "Submit Report", desc: "Security researchers submit vulnerability reports with IPFS evidence for review." },
  { num: 3, title: "Claim Payout", desc: "Approved researchers claim payouts on-chain and mint reputation NFTs." },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-bg-light py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-text-pri mb-4" style={{ fontSize: "clamp(28px, 4vw, 36px)" }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-text-sec font-body max-w-2xl mx-auto">Three simple steps from vulnerability discovery to verified payout.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-orange via-purple to-green" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative text-center"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange to-purple flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-white font-heading font-bold text-lg">{step.num}</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-text-pri mb-3">{step.title}</h3>
              <p className="text-text-sec font-body text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
