// NOTE: If using the Symfony integration, some changes need to be made to this file:
// - Replace `tailwind.defaultTheme` by `defaultTheme` and add this line to the top of the file:
//     const defaultTheme = require('tailwindcss/defaultTheme');
// - Inside the `plugins` array, add the following items:
//     require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')

tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', ...tailwind.defaultTheme.fontFamily.serif],
        'serif': ['Roboto\\ Slab', ...tailwind.defaultTheme.fontFamily.serif],
      },
      fontSize: {
        '3.5xl': ['32px', '48px'],
      },
      colors: {
        'main': '#3C4363',
        'hover-main': '#64748b',
        'hover-light': '#e2e8f0',
        'mod-sc-ev': '#2BB3A7',
        'mod-sc-ev-light': '#CEEEE3',
        'chart-color': '#B4E4D7',
        'mod-sc-ev-dark': '#1E6B65',
        'cluster-100': '#B0F2BC',
        'cluster-200': '#89E8AC',
        'cluster-300': '#67DBA5',
        'cluster-400': '#4CC8A3',
        'cluster-500': '#2BB3A7',
        brown: {
          // Practices
          500: '#BA7300',
        },
        yellow: {
          // Geospatial data
          500: '#FFD500',
        },
        purple: {
          // Datasets
          700: '#8380BC',
        },
        blue: {
          // Network
          500: '#358FE3',
        },
        ring: 'hsl(var(--ring))',
        gray: {
          50: '#F7F7F9',
          100: '#F0F0F5',
          200: '#CFD1DB',
          300: '#B2B5C5',
          800: '#3C4363',
        },
        green: {
          50: '#F7FCFA',
        }
      },
    },
  },
  plugins: [],
};