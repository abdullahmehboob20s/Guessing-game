module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        corben: ["Corben", "cursive"],
        trirong: ["Trirong", "serif"],
      },
      colors: {
        "custom-yellow": "#ffa822",
      },
    },
  },
  plugins: [],
};
