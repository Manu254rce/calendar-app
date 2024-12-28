/** @type {import('tailwindcss').Config} */
export const mode = 'jit';
export const content = ["./src/**/*.{html,js,jsx,ts,tsx}"];
export const darkMode = 'class';
export const theme = {
  extend: {
    fontFamily: {
      'garamond': 'EB Garamond',
      'dancing-script': 'Dancing Script',
      'kavivanar': 'Kavivanar',
      'pacifico': 'Pacifico',
    },
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
};
export const plugins = [];

