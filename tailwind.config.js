/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bege: {
          DEFAULT: '#EAE2D3',
          50: '#F7F4EF',
          100: '#EAE2D3',
          200: '#DDD0B8',
        },
        marrom: {
          DEFAULT: '#5A3E2B',
          light: '#7A5A42',
          dark: '#3D2A1D',
          50: '#F0EBE5',
        },
        dourado: {
          DEFAULT: '#C7A86D',
          light: '#D4B98A',
          dark: '#A88945',
          50: '#F5EFE3',
        },
        nude: '#D9C7BB',
        terracota: '#A06A4B',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.5em',
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(199, 168, 109, 0.25)',
        'gold-lg': '0 8px 48px rgba(199, 168, 109, 0.35)',
        'soft': '0 2px 20px rgba(90, 62, 43, 0.1)',
        'soft-lg': '0 8px 40px rgba(90, 62, 43, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-right': 'slideRight 0.4s ease forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideRight: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        shimmer: { '0%, 100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
      },
    },
  },
  plugins: [],
}
