import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        /* Brand: muted forest green */
        brand: {
          50: "#f2f8f4",
          100: "#e0efe5",
          200: "#c2dfcc",
          300: "#95c6a8",
          400: "#64a67f",
          500: "#438a61",
          600: "#316e4c",
          700: "#27583e",
          800: "#214733",
          900: "#1c3b2b",
          950: "#0d2118",
        },
        /* Sand: warm neutral surfaces */
        sand: {
          50: "#fbfaf7",
          100: "#f5f2ec",
          200: "#ebe6db",
          300: "#dcd4c4",
          400: "#c4b89f",
          500: "#a89877",
          600: "#8a7a5c",
          700: "#6f624a",
          800: "#5c513f",
          900: "#4c4335",
          950: "#292319",
        },
        /* Accent: warm amber for highlights */
        accent: {
          50: "#fff8eb",
          100: "#feefc7",
          200: "#fddc8a",
          300: "#fcc44d",
          400: "#f5b34a",
          500: "#e89b2c",
          600: "#cf7f18",
          700: "#a85f12",
          800: "#874a15",
          900: "#6f3d15",
        },
        ink: {
          DEFAULT: "#1c1917",
          muted: "#57534e",
          soft: "#78716c",
          faint: "#a8a29e",
        },
        /* shadcn semantic tokens */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,25,23,0.04), 0 8px 24px -12px rgba(28,25,23,0.12)",
        "card-hover":
          "0 2px 4px rgba(28,25,23,0.06), 0 20px 40px -16px rgba(28,25,23,0.22)",
        pill: "0 4px 14px -4px rgba(28,25,23,0.35)",
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
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
