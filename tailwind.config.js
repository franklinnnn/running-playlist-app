/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Khand"],
      body: ["Switzer"],
    },
  },
  prefix: "",
  daisyui: {
    themes: ["night", "cmyk", "bumblebee", "corporate"],
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
};
