/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    fontFamily:{
      "roboto": ["Roboto", "Ubuntu", "sans-serif"]
    },
    extend: {
      backgroundColor: {
        footer: '#111111',
        main: '#8A33FD',
        secondary: '#F6F6F6',
        icon: '#807D7E'
      },
      textColor: {
        secondary: '#8A8989',
      },
      fontSize: {
        "size-400": ["14px", "1.4em"],
        "size-500": ["16px", "1.4em"],
        "size-600": ["22px", "1.4em"],
        "size-700": ["2.5rem", "1.4em"],
        "size-800": ["3.5rem", "1.6em"],
      },
      colors:{
        black: "rgb(2,8,23)",
        "text-black": "#121212",
        yellow: "#ffc95c",
        gray: "#f3f5f7",
        blue: "#377dff",
      },
    }
  },
  plugins: []
}
