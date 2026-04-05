export default function Input({
  label, placeholder, value, onChange, error, helperText,
  leftIcon, rightElement, type = "text", className = "", ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-body font-medium text-text-pri">{label}</label>}
      <div className="relative">
        {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sec">{leftIcon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 py-3 rounded-btn border font-body text-sm transition-all duration-200
            ${leftIcon ? "pl-10" : ""}
            ${error ? "border-red-400 focus:outline-red-500" : "border-border-clr focus:outline-2 focus:outline-orange"}
            bg-white text-text-pri placeholder:text-text-sec
          `}
          {...props}
        />
        {rightElement && <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>}
      </div>
      {error && <p className="text-xs text-red-500 font-body">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-sec font-body">{helperText}</p>}
    </div>
  );
}
