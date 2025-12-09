/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neonBlue: "#00eaff", // 💡 custom neon color
      },
      boxShadow: {
        neon: "0 0 8px #00eaff, 0 0 16px #00eaff, 0 0 32px #00eaff",
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { textShadow: '0 0 8px #00eaff, 0 0 16px #00eaff' },
          '50%': { textShadow: '0 0 16px #00eaff, 0 0 32px #00eaff' },
        },
      },
      animation: {
        'neon-pulse': 'neon-pulse 1.5s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
