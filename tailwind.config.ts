import type { Config } from "tailwindcss";

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
      },
      keyframes: {
        shake: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
          '100%': { transform: 'translateX(0)' },
        },
        moveOffScreen: {
          '0%': {transform: 'translateX(0)'},
          '100%': { transform: 'translateX(-100vw)'}
        }
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        'move-left': 'moveOffScreen linear'
      },
    },
  },
  plugins: [],
} satisfies Config;
