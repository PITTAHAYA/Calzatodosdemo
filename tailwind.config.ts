import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rojo corporativo de Calzatodos Group. Editable desde aquí.
        brand: {
          50: "#fff1f1",
          100: "#ffdfdf",
          200: "#ffc5c5",
          300: "#ff9d9d",
          400: "#ff6464",
          500: "#f83535",
          600: "#e11919", // rojo principal
          700: "#bd1212",
          800: "#9c1414",
          900: "#811717",
          950: "#460707",
        },
        graphite: {
          50: "#f6f6f7",
          100: "#e2e3e5",
          200: "#c5c6ca",
          300: "#a0a2a8",
          400: "#7c7e86",
          500: "#61636b",
          600: "#4d4f55",
          700: "#404146",
          800: "#37383c",
          900: "#1c1d20", // grafito
          950: "#151517",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 4px 16px rgba(16,24,40,0.06)",
        "card-hover": "0 8px 30px rgba(16,24,40,0.12)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
