import type { Config } from "tailwindcss";
import { colors, spacing } from "./src/lib/design/tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
        card: "2rem",
      },
      fontFamily: {
        display: ["var(--font-eb-garamond)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "500" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "500" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "500" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      boxShadow: {
        organic: "0 8px 30px rgba(75, 54, 33, 0.08)",
        "organic-lg": "0 12px 30px rgba(75, 54, 33, 0.06)",
        "organic-nav": "0 4px 30px rgba(75, 54, 33, 0.05)",
        "fab-yellow": "0 12px 24px rgba(201, 169, 0, 0.3)",
      },
      maxWidth: {
        content: "1280px",
        prose: "768px",
      },
    },
  },
  plugins: [],
};

export default config;
