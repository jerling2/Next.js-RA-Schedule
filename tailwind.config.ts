import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        invalid: 'var(--invalid)',
        'invalid-hover': 'var(--invalid-hover)',
        focus: 'var(--focus)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'accent-15': 'var(--accent-15)',
        'accent-10': 'var(--accent-10)',
        'accent-hover': 'var(--accent-hover)',
        'background-1': 'var(--background-1)',
        'background-2': 'var(--background-2)',
        'background-3': 'var(--background-3)',
        'background-4': 'var(--background-4)',
        'background-5': 'var(--background-5)',
        'background-6': 'var(--background-6)',
        'background-7': 'var(--background-7)',
        text: 'var(--text)',
      },
      padding: {
        'dynamic-container': 'clamp(16px, 12%, 100vw)' //< using 100vw to denote "max->infinity".
      }, 
      boxShadow: {
        'direct': 'rgba(0, 0, 0, 0.3) 0px 10px 20px',
        'direct-b': 'rgba(0, 0, 0, 0.3) 0px 4px 1px -1px',
        'color': 'rgba(0, 0, 0, .4) 0px 0px 20px 15px, var(--secondary-25) -75px -75px 100px 10px, var(--accent-15) 75px 75px 100px 10px',
        'dashboard-header': 'rgba(0, 0, 0, .5) 0px 0px 15px 10px',
        'icon': 'rgba(255, 255, 255, .5) 0px 2px 5px 2px inset, rgba(0, 0, 0, .25) 0px -2px 5px 2px inset',
        'popup': 'rgba(0, 0, 0, 1) 0px 5px 10px 2px, rgba(255, 255, 255, 0.2) 0px 2px 5px -2px inset',
        'strobe': 'var(--secondary) -10px 10px 30px 50px, rgba(255, 0, 255, .1) -10px -10px 30px 50px, rgba(255, 255, 0, .8) 10px -10px 10px 20px, var(--accent) 10px 10px 30px 50px',
        'priority-box-primary-1': 'rgba(255, 255, 0, 0.05) 0px 0px 6px 1px inset',
        'priority-box-primary-2': 'rgba(255, 255, 0, 0.10) 0px 0px 6px 1px inset',
        'priority-box-primary-3': 'rgba(255, 255, 0, 0.15) 0px 0px 6px 1px inset',
        'priority-box-primary-4': 'rgba(255, 255, 0, 0.20) 0px 0px 6px 1px inset',
        'priority-box-primary-5': 'rgba(255, 255, 0, 0.25) 0px 0px 6px 1px inset',
        'priority-box-primary-6': 'rgba(255, 255, 0, 0.30) 0px 0px 6px 1px inset',
        'priority-box-primary-7': 'rgba(255, 255, 0, 0.35) 0px 0px 6px 1px inset',
        'priority-box-primary-8': 'rgba(255, 255, 0, 0.40) 0px 0px 6px 1px inset',
        'priority-box-primary-9': 'rgba(255, 255, 0, 0.45) 0px 0px 6px 1px inset',
        'priority-box-primary-10': 'rgba(255, 255, 0, 0.50) 0px 0px 6px 1px inset',
        'priority-box-primary-11': 'rgba(255, 255, 0, 0.55) 0px 0px 6px 1px inset',

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
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'accordionOpen200': {
          '0%': { 'max-height': '0px', opacity: '0%'},
          '100%': { 'max-height': '200px', opacity: '100%'}
        }, 
        'accordionClose200': {
          '0%': { 'max-height': '200px', opacity: '100%'},
          '100%': { 'max-height': '0px', opacity: '100'}
        },
        'accordionOpen400': {
          '0%': { 'max-height': '0px', opacity: '0%'},
          '100%': { 'max-height': '400px', opacity: '100%'}
        }, 
        'accordionClose400': {
          '0%': { 'max-height': '400px', opacity: '100%'},
          '100%': { 'max-height': '0px', opacity: '100'}
        }

        
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        'move-left': 'moveOffScreen linear',
        'slow-spin': 'spin 10s linear infinite',
        'accordion-open-200': 'accordionOpen200 0.5s ease-in-out',
        'accordion-open-400': 'accordionOpen400 0.5s ease-in-out',
        'accordion-close-200': 'accordionClose200 0.5s ease-in-out',
        'accordion-close-400': 'accordionClose400 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
