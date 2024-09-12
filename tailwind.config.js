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
      display: ["Racing Sans One"],
      body: ["Switzer"],
    },
  },
  prefix: "",
  daisyui: {
    themes: ["night", "cmyk", "bumblebee", "corporate"],
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
};
