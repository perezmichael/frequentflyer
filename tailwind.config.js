/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-space-grotesk)', 'sans-serif'],
        },
        colors: {
          background: '#E9E3D7',
          primary: '#4285F4',
        },
      },
    },
    plugins: [],
  };