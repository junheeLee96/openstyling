module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        toast: "toast 4s ease-in-out",
      },
      keyframes: {
        toast: {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
          "80%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
      colors: {
        clickedbg: "rgb(23,23,25)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGray: "rgb(224, 224, 227)",
        toastBg: "rgb(42,44,54)", // 토스트 배경색
        underred: "rgb(241,30,48)", // 하단 배경색
      },
    },
  },
  plugins: [],
};
