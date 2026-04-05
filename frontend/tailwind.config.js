/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange:       "#FF6A00",
        purple:       "#7B3FF2",
        green:        "#22C55E",
        blue:         "#3B82F6",
        "bg-dark":    "#0B0B0F",
        "bg-section": "#111827",
        "bg-light":   "#F9FAFB",
        "text-pri":   "#111827",
        "text-sec":   "#6B7280",
        "border-clr": "#E5E7EB",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #FF6A00, #7B3FF2)",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn:  "12px",
        pill: "999px",
      },
      boxShadow: {
        card:          "0 10px 30px rgba(0,0,0,0.1)",
        glow:          "0 0 40px rgba(255,106,0,0.4)",
        "glow-purple": "0 0 40px rgba(123,63,242,0.4)",
        glass:         "0 8px 32px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
