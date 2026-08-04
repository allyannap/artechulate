import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'paper-ivory': '#F6F1E8',
        'warm-sand': '#E8DBC8',
        'soft-taupe': '#A08F7F',
        'ink-brown': '#2C2221',
        'blush-coral': '#EFAE9C',
        'apricot-glow': '#F4D49F',
        'pale-lilac': '#D8D2EA',
        'mist-blue': '#DCE6F0',
        scarlet: '#C15B42',
        marigold: '#E8B23D',
        'sage-green': '#BFD6A4',
      },
      fontFamily: {
        heading: ['"DM Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        md: '14px',
        lg: '18px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 2px 20px rgba(44, 34, 33, 0.06)',
      },
      keyframes: {
        'pulse-warm': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'blink-cursor': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        'pulse-warm': 'pulse-warm 1s ease-in-out infinite',
        'blink-cursor': 'blink-cursor 1s steps(1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
