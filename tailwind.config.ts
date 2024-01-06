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
