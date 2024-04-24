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
        '2xs': ['10px', '16px'],
      },
      colors: {
        'main': '#3C4363',
        'hover-main': '#64748b',
        'hover-light': '#e2e8f0',
        'mod-sc-ev': '#2BB3A7',
        'mod-sc-ev-light': '#CEEEE3',
        'chart-color': '#B4E4D7',
        'mod-sc-ev-dark': '#239288',
        brown: {
          // Practices
          500: '#BA7300',
        },
        yellow: {
          // Geospatial data
          400: '#FFE08A',
          500: '#FFD500',
          700: '#E4AE00'
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
          150: '#E9EAF0',
          200: '#CFD1DB',
          300: '#B2B5C5',
          500: '#6E7389',
          600: '#565D79',
          650: '#4D5370',
          700: '#3C4363',
          800: '#2C324B',
        },
        neutral: {
          300: '#C1C3CE',
        },
        green: {
          50: '#F7FCFA',
        }
      },
    },
  },
  plugins: [],
};