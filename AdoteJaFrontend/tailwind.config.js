/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terracota: {
          50:  '#fdf3ee',
          100: '#fae3d5',
          200: '#f4c4aa',
          300: '#eb9d77',
          400: '#e07245',
          500: '#C4613A',
          600: '#b04d2c',
          700: '#923d25',
          800: '#773324',
          900: '#622d21',
        },
        creme: {
          50:  '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5EFE4',
          300: '#EDE2CE',
          400: '#E2D1B5',
        },
        areia: {
          100: '#F0E8D8',
          200: '#E8DCC8',
          300: '#D9C9AE',
          400: '#C9B492',
        },
        floresta: {
          50:  '#eef2ee',
          100: '#d3e0d4',
          200: '#a8c2aa',
          300: '#739f76',
          400: '#4a7c4e',
          500: '#2C3E2D',
          600: '#253426',
          700: '#1e2a1f',
          800: '#172019',
          900: '#121812',
        },
        carbon: {
          800: '#1C1C1C',
          900: '#111111',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'warm': '0 4px 24px -4px rgba(196, 97, 58, 0.15)',
        'card': '0 1px 3px rgba(28, 28, 28, 0.06), 0 4px 16px rgba(28, 28, 28, 0.04)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
