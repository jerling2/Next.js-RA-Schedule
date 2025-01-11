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
      padding: {
        'dynamic-container': 'clamp(16px, 12%, 100vw)' //< using 100vw to denote "max->infinity".
      }, 
      boxShadow: {
        'direct': 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
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
