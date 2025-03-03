import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pending': '#ffb74d',
        'win': '#81c784',
        'lose': '#e57373'
      }
    },
  },
} satisfies Config;

export default config;