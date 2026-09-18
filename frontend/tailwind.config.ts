import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Satoshi", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        paytm: {
          blue: "#00baf2",
          dark: "#002970",
          navy: "#001645",
          cyan: "#2bc6ff",
          light: "#e8f7fd",
          hover: "#0099cc",
        },
        surface: {
          light: "#ffffff",
          dark: "#111827",
          subtle: "#f8fafc",
          subtleDark: "#1e293b",
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 41, 112, 0.06), 0 4px 6px -2px rgba(0, 41, 112, 0.03)",
        card: "0 10px 25px -5px rgba(0, 41, 112, 0.07), 0 8px 10px -6px rgba(0, 41, 112, 0.04)",
        glow: "0 0 20px -2px rgba(0, 186, 242, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
