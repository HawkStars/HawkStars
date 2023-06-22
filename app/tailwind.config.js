/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        success: "#0A7558",
        body: "FEF9F6",
        disabled: "#AAA9A9",
        bege: {
          dark: "#FAE7D0",
          light: "#FEF9F6",
        },
      },
    },
  },
  plugins: [],
};
