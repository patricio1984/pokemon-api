/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nearblack: '#0A0A0A',
        surface: '#1A1A1A',
        white: 'var(--tw-color-white)',
        black: 'var(--tw-color-black)',
        yellow: '#E8FF00',
        red: '#FF2D55'
      },
      fontFamily: {
        heading: ['Syne', 'system-ui', 'sans-serif'],
        terminal: ['VT323', 'monospace'],
        code: ['IBM Plex Mono', 'monospace']
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      spacing: {
        '9/16': '56.25%'
      },
      boxShadow: {
        soft: '0 6px 20px rgba(2,6,23,0.5), inset 0 1px 0 rgba(255,255,255,0.02)',
        lift: '0 10px 30px rgba(2,6,23,0.6)'
      },
      keyframes: {
        'shift-gradient': {
          '0%': { transform: 'translateX(-10%)' },
          '50%': { transform: 'translateX(10%)' },
          '100%': { transform: 'translateX(-10%)' }
        }
      },
      animation: {
        'shift-gradient': 'shift-gradient 12s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
