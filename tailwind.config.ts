import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          dark: '#1B3557',
          accent: '#20C9A6',
          sand: '#F5E6D3',
          light: '#E8F4F8',
        },
      },
    },
  },
  plugins: [],
}
export default config