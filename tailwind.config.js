module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsla(223.019, 28.96%, 35.88%, 1)',
        secondary: 'hsla(227.647, 15.45%, 43.14%, 1)',
        tertiary: 'hsla(172.025, 64.75%, 47.84%, 1)',
        'dark-primary': 'hsla(223, 29%, 17%, 1)',
        'light-dark': 'hsla(0, 0%, 0%, 0.075)'
      },
      borderRadius: {
        'bubble-left': '16px 16px 16px 0px',
        'bubble-right': '16px 16px 0px 16px'
      },
      animation: {
        'fade-in': 'fade-in 100ms ease-in',
        'pop-up': 'pop-up 100ms ease-in',
        'reverse-angle': 'reverse-angle 100ms ease-in forwards',
        'slide-up': 'slide-up 200ms ease-in forwards'
      },
    },
  },
  plugins: [],
}
