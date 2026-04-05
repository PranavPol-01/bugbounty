"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Alex Chen", role: "Security Researcher", quote: "DecentraBounty made it incredibly easy to submit reports and get paid on-chain. No more waiting for companies to process payments.", avatar: "AC" },
  { name: "Sarah Patel", role: "DeFi Protocol Lead", quote: "We set up our bounty vault in minutes. The escrow system gives researchers confidence and us security.", avatar: "SP" },
  { name: "Mike Johnson", role: "Smart Contract Auditor", quote: "The reputation NFTs are a game-changer. They serve as verifiable proof of my security contributions.", avatar: "MJ" },
  { name: "Emily Davis", role: "Governance Authority", quote: "The on-chain governance review process is transparent and efficient. Every decision is immutably recorded.", avatar: "ED" },
  { name: "David Kim", role: "Bug Hunter", quote: "I've earned 12 ETH through DecentraBounty. The multi-severity reward system is fair and well-designed.", avatar: "DK" },
];

export default function TestimonialsSection() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (!isPaused) {
        el.scrollBy({ left: 320, behavior: "smooth" });
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="bg-bg-light py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-bold text-text-pri mb-4" style={{ fontSize: "clamp(28px, 4vw, 36px)" }}>
            Trusted by <span className="gradient-text">Researchers</span>
          </h2>
        </motion.div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="min-w-[300px] max-w-[300px] bg-white border border-border-clr rounded-xl p-6 shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange to-purple flex items-center justify-center text-white font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-heading font-semibold text-sm text-text-pri">{t.name}</div>
                  <div className="text-xs text-text-sec font-body">{t.role}</div>
                </div>
              </div>
              <p className="text-sm text-text-sec font-body leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
