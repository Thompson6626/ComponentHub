/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  corePlugins :{ preflight: false },
  plugins: [
    //require('daisyui'),
    require('tailwindcss-primeui')
  ],
}

