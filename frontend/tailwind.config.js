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
    }
  },
};
export const plugins = [];

