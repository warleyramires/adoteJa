/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        azul: {
          50:  '#EEF3FA',
          100: '#D3E2F1',
          200: '#A7C4E3',
          300: '#6E9CC9',
          400: '#2D5285',
          500: '#1E3A5F',
          600: '#172D4C',
          700: '#10213A',
          800: '#0B1628',
          900: '#070E1C',
        },
        ambar: {
          50:  '#FEF8E6',
          100: '#FCEEC0',
          200: '#F9DB82',
          300: '#F6CB54',
          400: '#E8A838',
          500: '#D4940A',
          600: '#B07A08',
          700: '#8A5E06',
          800: '#664506',
          900: '#3D2803',
        },
        creme: {
          50:  '#FDFCFB',
          100: '#F8F6F2',
          200: '#F0EDE6',
          300: '#E5E0D6',
          400: '#D9D2C5',
        },
        pedra: {
          100: '#EEE9E2',
          200: '#E4DED6',
          300: '#D4CCBF',
          400: '#C2B8A9',
        },
        carbon: {
          800: '#1A1A2E',
          900: '#0F0F1A',
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
        'warm': '0 4px 24px -4px rgba(212, 148, 10, 0.20)',
        'card': '0 1px 3px rgba(26, 26, 46, 0.06), 0 4px 16px rgba(26, 26, 46, 0.04)',
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
