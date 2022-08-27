/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{html,js}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        'dark-blue': '#11214e',
      },
      fontFamily: {
        "star-wars": ["Starwars", ...defaultTheme.fontFamily.sans],
        raleway: ["Raleway", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        disappear: "disappear 1s ease-out",
      },
      keyframes: {
        disappear: {
          "0%": { opacity: "100%" },
          "100%": { opacity: "0%", scale: "2" },
        },
      },
    },
  },
  plugins: [],
};
