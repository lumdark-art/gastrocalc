/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#11100e',
        espresso: '#1a1511',
        crema: '#f1dfc3',
        latte: '#c9a46a',
        caramel: '#d1843b',
        cocoa: '#6f4b2e',
      },
      boxShadow: {
        glow: '0 14px 42px rgba(209, 132, 59, 0.11)',
      },
    },
  },
  plugins: [],
};
