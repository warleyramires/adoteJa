/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — warm brown/orange
        'primary':                    '#934b00',
        'primary-container':          '#f28c33',
        'primary-fixed':              '#ffdcc4',
        'primary-fixed-dim':          '#ffb781',
        'on-primary':                 '#ffffff',
        'on-primary-container':       '#5f2e00',
        'on-primary-fixed':           '#301400',
        'on-primary-fixed-variant':   '#703800',
        // Secondary — blue
        'secondary':                  '#0060ac',
        'secondary-container':        '#68abff',
        'secondary-fixed':            '#d4e3ff',
        'secondary-fixed-dim':        '#a4c9ff',
        'on-secondary':               '#ffffff',
        'on-secondary-container':     '#003e73',
        'on-secondary-fixed':         '#001c39',
        'on-secondary-fixed-variant': '#004883',
        // Tertiary — gold
        'tertiary':                   '#785a00',
        'tertiary-container':         '#c9a03a',
        'tertiary-fixed':             '#ffdf9b',
        'tertiary-fixed-dim':         '#edc157',
        'on-tertiary':                '#ffffff',
        'on-tertiary-container':      '#4c3800',
        'on-tertiary-fixed':          '#251a00',
        'on-tertiary-fixed-variant':  '#5b4300',
        // Surface hierarchy
        'surface':                    '#faf9f8',
        'surface-bright':             '#faf9f8',
        'surface-dim':                '#dadad9',
        'surface-variant':            '#e3e2e1',
        'surface-tint':               '#934b00',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#f4f3f2',
        'surface-container':          '#eeeeed',
        'surface-container-high':     '#e9e8e7',
        'surface-container-highest':  '#e3e2e1',
        // On-surface
        'on-surface':                 '#1a1c1c',
        'on-surface-variant':         '#554337',
        'inverse-surface':            '#2f3130',
        'inverse-on-surface':         '#f1f0f0',
        'inverse-primary':            '#ffb781',
        // Outline
        'outline':                    '#887365',
        'outline-variant':            '#dbc2b1',
        // Error
        'error':                      '#ba1a1a',
        'error-container':            '#ffdad6',
        'on-error':                   '#ffffff',
        'on-error-container':         '#93000a',
        // Background
        'background':                 '#faf9f8',
        'on-background':              '#1a1c1c',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        display:  ['"Plus Jakarta Sans"', 'sans-serif'],
        body:     ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        label:    ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg:      '2rem',
        xl:      '3rem',
        full:    '9999px',
      },
      boxShadow: {
        editorial:      '0 12px 40px rgba(85, 67, 55, 0.08)',
        'editorial-lg': '0 20px 50px rgba(85, 67, 55, 0.12)',
        warm:           '0 4px 24px -4px rgba(147, 75, 0, 0.20)',
        card:           '0 1px 3px rgba(26, 26, 46, 0.06), 0 4px 16px rgba(26, 26, 46, 0.04)',
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
