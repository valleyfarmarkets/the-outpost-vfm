import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-playfair)", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "var(--outpost-red)", // Primary CTAs, links, pricing
          secondary: "var(--charcoal)", // Dark text, overlays
          accent: "var(--harvest-gold)", // Highlights, badges
          terracotta: "var(--terracotta)", // Warm accents
          sunflower: "var(--sunflower)", // Bright accents
          cream: "var(--warm-lodge-cream)", // Light backgrounds
        },
      },
    },
  },
  plugins: [],
};

export default config;
