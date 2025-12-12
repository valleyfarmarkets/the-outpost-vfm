import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "#8B4513", // Saddle brown
          secondary: "#2F4F4F", // Dark slate gray
          accent: "#D2691E", // Chocolate
        },
      },
    },
  },
  plugins: [],
};

export default config;
