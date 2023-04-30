import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#060606",
        "secondary": "#FF5A00",
        "tertiary": "#d4c047"        
      },      
      fontFamily: {
        'titillium-web': ['Titillium', 'sans-serif'],
        'test': ['Delicious Handrawn', 'cursive']
      }
    },    
  },
  important: true,
  plugins: [],
} satisfies Config;
