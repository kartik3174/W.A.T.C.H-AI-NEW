import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Dark Background, Electric Blue, Neon Orange & Soft White Theme Colors
        "theme-dark-bg": "#0B132B",
        "theme-electric-blue": "#1C7ED6",
        "theme-neon-orange": "#FF7A00",
        "theme-soft-white": "#EAEAEA",
        // Alert Colors
        "alert-low": "hsl(var(--alert-low))",
        "alert-warning": "hsl(var(--alert-warning))",
        "alert-threat": "hsl(var(--alert-threat))",
        "alert-critical": "hsl(var(--alert-critical))",
        // Chart Colors
        "chart-primary": "hsl(var(--chart-primary))",
        "chart-secondary": "hsl(var(--chart-secondary))",
        "chart-highlight": "hsl(var(--chart-highlight))",
        "chart-grid": "hsl(var(--chart-grid))",
        "chart-label": "hsl(var(--chart-label))",
        "chart-bg": "hsl(var(--chart-bg))",
        // Wildlife-specific colors
        "wildlife-green": {
          DEFAULT: "#2e7d32",
          50: "#e8f5e9",
          100: "#c8e6c9",
          200: "#a5d6a7",
          300: "#81c784",
          400: "#66bb6a",
          500: "#4caf50",
          600: "#43a047",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
        },
        "wildlife-orange": {
          DEFAULT: "#f56a00",
          50: "#fff3e0",
          100: "#ffe0b2",
          200: "#ffcc80",
          300: "#ffb74d",
          400: "#ffa726",
          500: "#ff9800",
          600: "#fb8c00",
          700: "#f57c00",
          800: "#ef6c00",
          900: "#e65100",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "leaf-sway": {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        "pulse-red": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "pulse-green": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "glow": {
          "0%, 100%": { 
            boxShadow: "0 0 10px rgba(102, 187, 106, 0.6)" 
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(102, 187, 106, 0.8), 0 0 30px rgba(102, 187, 106, 0.4)" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "leaf-sway": "leaf-sway 5s ease-in-out infinite",
        "pulse-red": "pulse-red 1s infinite",
        "pulse-green": "pulse-green 1.5s infinite",
        "glow": "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
