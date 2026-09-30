export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // accent flips blue -> purple via [data-theme="web3"] CSS vars
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        ink: '#0b030e',
        muted: '#7c7c7c',
        canvas: '#ebebeb',
      },
      fontFamily: {
        exo: ['"Exo 2"', 'sans-serif'],
        phudu: ['Phudu', 'sans-serif'],
      },
      borderRadius: {
        base: '12px',
      },
    },
  },
  plugins: [],
};
