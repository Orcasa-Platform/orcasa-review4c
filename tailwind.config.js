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
        'mod-sc-ev': '#2BB3A7',
        'mod-sc-ev-light': '#CEEEE3',
        'mod-sc-ev-dark': '#1E6B65',
      },
    },
  },
  plugins: [],
};