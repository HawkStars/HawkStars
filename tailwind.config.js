/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: '#0A7558',
        disabled: '#5B5B5B',
        bege: {
          dark: '#FAE7D0',
          light: '#FEF9F6',
        },
        linkedin: '#0A66C2',
      },
      zIndex: {
        900: 900,
      },
    },
  },
  plugins: [],
};
