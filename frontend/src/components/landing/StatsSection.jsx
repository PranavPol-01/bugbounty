"use client";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function CountUp({ target, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      const mv = { val: 0 };
      const controls = animate(mv, { val: target }, {
        duration: 1.5,
        onUpdate: (v) => setDisplay(Math.floor(v.val).toLocaleString()),
      });
      return controls.stop;
    }
  }, [isInView, target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const stats = [
  { value: 127, suffix: "", label: "Active Vaults", color: "border-text-pri" },
  { value: 2.4, suffix: "M", label: "Paid Out", color: "border-orange", prefix: "$" },
  { value: 4800, suffix: "", label: "Reports Filed", color: "border-purple" },
  { value: 890, suffix: "", label: "Researchers", color: "border-green" },
];

export default function StatsSection() {
  return (
    <section className="bg-bg-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-6 text-center border-t-2 ${stat.color}`}
            >
              <div className="text-3xl font-heading font-bold text-white mb-2">
                {stat.prefix || ""}<CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-body text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
