"use client";
import { motion } from "framer-motion";

const variantClasses = {
  glass: "glass-card",
  "glass-light": "glass-card-light",
  solid: "bg-white border border-border-clr rounded-card shadow-card",
};

const glowClasses = {
  orange: "glow-orange",
  purple: "glow-purple",
  none: "",
};

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  variant = "solid", glow = "none", padding = "md",
  className = "", children, onClick, hover = true,
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { type: "spring", stiffness: 300 } } : {}}
      onClick={onClick}
      className={`
        ${variantClasses[variant]}
        ${glowClasses[glow]}
        ${paddingClasses[padding]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
