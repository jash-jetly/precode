/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          light: '#f9fafb',
          DEFAULT: '#d1d5db',
          dark: '#1f2937',
        },
        accent: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
