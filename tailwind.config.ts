import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        tall: { raw: "(min-height: 1500px)" },
        tallmd: { raw: "(max-height: 600px)" },
        short: { raw: "((min-width: 640px) and (max-height: 450px))" },
        shortnav: { raw: "(max-height: 450px)" },
        xs: "400px",
      },
      colors: {
        secondTheme: "#282828",
        mainTheme: "#ffa500",
      },
    },
  },
  plugins: [],
};
export default config;
