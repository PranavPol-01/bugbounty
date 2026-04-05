"use client";

export default function Select({ label, value, onChange, options = [], placeholder, error, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-body font-medium text-text-pri">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-btn border ${error ? "border-red-400" : "border-border-clr"} font-body text-sm focus:outline-2 focus:outline-orange bg-white appearance-none cursor-pointer`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-body">{error}</p>}
    </div>
  );
}
