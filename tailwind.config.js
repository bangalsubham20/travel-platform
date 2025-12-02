/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0A0A0A', // Charcoal/Black
          800: '#121212',
          700: '#1A1A1A',
        },
        teal: {
          900: '#0F292D', // Deep Teal Background
          800: '#134E4A',
          700: '#115E59',
          600: '#0D9488',
          500: '#14B8A6',
          400: '#2DD4BF', // Bright Teal
          300: '#5EEAD4',
          200: '#99F6E4',
          100: '#CCFBF1',
          50: '#F0FDFA',
        },
        cyan: {
          500: '#00E5FF', // Bright Cyan Accent
          600: '#00B8D4',
        },
        forest: {
          900: '#1A2F23', // Dark Forest Green
          800: '#22543D',
        },
        grey: {
          400: '#A0AEC0', // Muted Light Grey
        },
        // Keeping some legacy colors mapped to new ones for backward compatibility if needed, 
        // or just removing them to force update. I'll map primary to teal/cyan gradient in components.
        primary: {
          500: '#00E5FF', // Mapping primary to bright cyan for now
          600: '#00B8D4',
        },
      },
      fontFamily: {
        sans: ['"Lobster Two"', 'cursive', ...defaultTheme.fontFamily.sans],
        display: ['"Permanent Marker"', 'cursive', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/patterns/hero.svg')",
        'dark-overlay': 'linear-gradient(to bottom, rgba(15, 41, 45, 0.3), rgba(10, 10, 10, 0.9))',
      },
      boxShadow: {
        'neon-primary': '0 0 20px rgba(0, 229, 255, 0.3)',
        'neon-primary-hover': '0 0 30px rgba(0, 229, 255, 0.5)',
        'neon-secondary': '0 0 20px rgba(0, 229, 255, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
