/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#E50914',
        secondary: '#000000',
        gray: '#374151',
      },
      fontFamily: {
        'Poppins-Regular': ['Poppins-Regular'],
        'Poppins-Bold': ['Poppins-Bold'],
        'Poppins-Light': ['Poppins-Light'],
        'Poppins-SemiBold': ['Poppins-SemiBold'],
      },
    },
  },
  plugins: [],
};
