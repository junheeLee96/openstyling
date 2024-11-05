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
        clickedbg: "rgb(23,23,25)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGray: "rgb(224, 224, 227)",
      },
    },
  },
  plugins: [],
};
export default config;
