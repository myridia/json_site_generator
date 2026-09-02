module.exports = {
  content: [
    "./components/**/*.{vue,js}",
    "./pages/**/*.vue",
    "./content/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        myridia: {
          green: "#88bb00",
          ink: "#333333",
          muted: "#8a8a8a",
          bg: "#eeeeee",
          linkvisited: "#22744a",
        },
      },
      fontFamily: {
        heading: ['times', '"Times New Roman"', 'serif'],
        body: ['arial', 'helvetica', 'sans-serif'],
      },
    },
  },
};
