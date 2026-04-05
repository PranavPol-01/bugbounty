"use client";
import { motion } from "framer-motion";

const variants = {
  primary: "bg-orange text-white hover:shadow-glow",
  secondary: "bg-purple text-white hover:shadow-glow-purple",
  outline: "bg-transparent text-text-pri border border-border-clr hover:border-orange",
  ghost: "bg-transparent text-text-sec hover:text-text-pri",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  variant = "primary", size = "md", loading = false,
  leftIcon, rightIcon, disabled, onClick, children, className = "", type = "button"
}) {
  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-heading font-medium rounded-btn
        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}
