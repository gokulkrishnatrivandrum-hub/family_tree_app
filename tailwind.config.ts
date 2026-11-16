import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5B5BD6",
          hover: "#4b4bc0",
          light: "#EEF0FF",
          50: "#f5f6ff",
          100: "#ebeeff",
          500: "#5B5BD6",
          600: "#4B4BC0",
          700: "#3D3DA3",
        },
        secondary: {
          DEFAULT: "#16A6A1",
          hover: "#128e8a",
          light: "#E8FAF9",
          500: "#16A6A1",
        },
        accent: {
          DEFAULT: "#F2B66D",
          light: "#FEF7EE",
          500: "#F2B66D",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F8FC",
          card: "#FFFFFF",
        },
        font: {
          main: "#202235",
          muted: "#74788B",
        },
        line: {
          border: "#E7E9F1",
        },
        danger: {
          DEFAULT: "#D94B5B",
        }
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(91, 91, 214, 0.08)",
        card: "0 2px 12px rgba(32, 34, 53, 0.05)",
        highlight: "0 0 0 4px rgba(91, 91, 214, 0.2)",
        node: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(91, 91, 214, 0.6)' },
          '50%': { boxShadow: '0 0 30px rgba(91, 91, 214, 0.9)' },
        },
        dashDraw: {
          to: { strokeDashoffset: '0' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
      }
    },
  },
  plugins: [],
};
export default config;
