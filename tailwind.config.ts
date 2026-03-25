import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // <-- Tambahkan 'src' di sini
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',
        darker: '#020617',
        brand: {
          blue: '#2563eb',
          cyan: '#06b6d4',
        }
      },
    },
  },
  plugins: [],
}
export default config