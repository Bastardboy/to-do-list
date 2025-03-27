/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", // si usas Flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [
    (require("flowbite/plugin")),

  ],
};
