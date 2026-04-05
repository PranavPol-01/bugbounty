const variantStyles = {
  critical: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  high:     { bg: "bg-orange/10", text: "text-orange", dot: "bg-orange" },
  medium:   { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  low:      { bg: "bg-green/10", text: "text-green", dot: "bg-green" },
  pending:  { bg: "bg-blue/10", text: "text-blue", dot: "bg-blue" },
  approved: { bg: "bg-green/10", text: "text-green", dot: "bg-green" },
  rejected: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
  paid:     { bg: "bg-purple/10", text: "text-purple", dot: "bg-purple" },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export default function Badge({ variant = "pending", size = "md", children }) {
  const style = variantStyles[variant.toLowerCase()] || variantStyles.pending;

  return (
    <span className={`
      inline-flex items-center gap-1.5 font-body font-medium rounded-pill
      ${style.bg} ${style.text} ${sizeClasses[size]}
    `}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {children}
    </span>
  );
}
