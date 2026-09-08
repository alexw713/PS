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
        ink: {
          50: "#f7f5f8",
          100: "#efeaf2",
          200: "#d9cfe0",
          300: "#b9a7c4",
          400: "#9479a3",
          500: "#755a84",
          600: "#5f476b",
          700: "#4e3a58",
          800: "#413249",
          900: "#382c3e",
          950: "#211824",
        },
      },
    },
  },
  plugins: [],
};
export default config;
