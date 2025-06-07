/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/**/*.{js,ts,jsx,tsx,blade.php}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'lr-bg': "url('/images/LR.png')",
      },
    },
  },
  plugins: [],
}
