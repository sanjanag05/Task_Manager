module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DA70D6",
        "primary-dark": "#D8BFD8",
      },
      animation: {
        loader: "loader 1s linear infinite",
      },
      keyframes: {
        loader: {
          "0%": { transform: "rotate(0) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.5)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
      },
    },
  },
  plugins: [
    // include Flowbite as a plugin in your Tailwind CSS project
    require("flowbite/plugin"),
  ],
};
