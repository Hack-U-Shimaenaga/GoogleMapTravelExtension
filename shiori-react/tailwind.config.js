/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        green: {
          1: "#CDE8E5",
          2: "#7AB2B2",
          3: "#4D869C",
        },

        blue: {
          1: "#EEF7FF"
        },
        
        white: {
          1: "#FBF8EF"
        }
        
      }
    },
  },
  plugins: [],
}

