import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "background": "#ffffff",
        "primary": "#29767a",
        "secondary": "#eceeef",
        "accent": "#938380",
        "text": "#101313"
        // "additional": "#E8ECF0"   
      },      
      fontFamily: {
        'titillium-web': ['Titillium', 'sans-serif'],
        'garamond': ['Garamond', 'serif'],
        'roboto': ['Roboto', 'sans-serif']
      }
    },    
  },
  important: true,
  plugins: [],
} satisfies Config;
