/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0d0e12",
        surface: "#16171f",
        borderCustom: "#242631",
        accentCustom: "#5a4afc",
        textPrimary: "#f1f2f6",
        textSecondary: "#8a8f9d",

        // SRS Taxonomy Colors
        moment: "#ffb020",
        vibe: "#9b51e0",
        spark: "#00e676",
        reminder: "#ff5252",
      },
      fontFamily: {
        heading: ["Inter", "SF Pro Display", "sans-serif"],
        body: ["Inter", "SF Pro Text", "sans-serif"],
      },
    },
  },
  plugins: [],
};
