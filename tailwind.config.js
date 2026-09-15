/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F9F1',
          100: '#E4F2E3',
          200: '#C6E4C6',
          300: '#9BD09D',
          400: '#5CB162',
          500: '#2E9138',
          600: '#1E6B27',
          700: '#1A5C22',
          800: '#154A1C',
          900: '#0F3714',
        },
        ink: {
          DEFAULT: '#101828',
          soft: '#475467',
          mute: '#98A2B3',
          line: '#E7EAE6',
        },
        status: {
          pending: '#B25E09',
          pendingBg: '#FDF0E3',
          processing: '#2F5FD0',
          processingBg: '#EEF2FF',
          transit: '#1E6B27',
          transitBg: '#E8F4E9',
          delivered: '#1E6B27',
          deliveredBg: '#E8F4E9',
          cancelled: '#C43C3C',
          cancelledBg: '#FDECEC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)',
        lift: '0 8px 24px rgba(16,24,40,.10)',
        nav: '0 -2px 16px rgba(16,24,40,.06)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'pop-in': { '0%': { opacity: '0', transform: 'scale(.82)' }, '60%': { transform: 'scale(1.06)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'toast-in': { from: { opacity: '0', transform: 'translateY(-14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in .35s ease both',
        'slide-up': 'slide-up .35s cubic-bezier(.22,1,.36,1) both',
        'pop-in': 'pop-in .5s cubic-bezier(.22,1,.36,1) both',
        'toast-in': 'toast-in .28s cubic-bezier(.22,1,.36,1) both',
      },
    },
  },
  plugins: [],
}
