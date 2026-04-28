import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-dm)', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif:   ['var(--font-lora)', 'Lora', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50:  '#E6F4ED',
          100: '#C6E8D4',
          500: '#1A8A52',
          600: '#0D7A47',
          700: '#0A5C36',
          800: '#063D24',
          900: '#052E16',
        },
        orange: {
          50:  '#FFF7F0',
          100: '#FFEDD5',
          500: '#FF6B35',
          600: '#E55A28',
        },
        motor: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        medical: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          600: '#059669',
          700: '#047857',
        },
        travel: {
          50:  '#FFFBEB',
          100: '#FDE68A',
          600: '#D97706',
          700: '#B45309',
        },
        business: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          600: '#7C3AED',
          700: '#6D28D9',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
        '5xl': '32px',
      },
      boxShadow: {
        'card':  '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'lift':  '0 8px 32px rgba(0,0,0,0.10)',
        'hover': '0 20px 60px rgba(0,0,0,0.12)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
