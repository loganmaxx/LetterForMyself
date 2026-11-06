/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          bg: '#FAF6F0',
          warm: '#F4EDE2',
          card: '#FFFDF9',
          border: '#E5DEC9',
          deep: '#EAE0D0',
        },
        ink: {
          900: '#2A2421',
          800: '#3D3530',
          700: '#544943',
          600: '#6E6259',
          500: '#8C7E75',
          400: '#AFA39A',
          300: '#D1C7BE',
        },
        botanical: {
          50: '#F3F7F4',
          100: '#E3EDE6',
          200: '#C5DBD0',
          300: '#9BBFB0',
          400: '#6E9E8B',
          500: '#4E7E6B',
          600: '#3B6353',
          700: '#2F4F43',
          800: '#263F36',
          900: '#1F332C',
        },
        terracotta: {
          50: '#FDF5F2',
          100: '#FBE8E1',
          200: '#F6D0C2',
          300: '#EEB099',
          400: '#E38868',
          500: '#D46A44',
          600: '#B85330',
          700: '#974226',
          800: '#7B3822',
          900: '#65301F',
        },
        amberwarm: {
          50: '#FEFBF3',
          100: '#FDF4DF',
          200: '#FAE5B8',
          300: '#F5D089',
          400: '#EEB454',
          500: '#E2982B',
          600: '#C4791D',
          700: '#9E5C19',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Lora', 'Georgia', 'serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(61, 53, 48, 0.06), 0 2px 6px -1px rgba(61, 53, 48, 0.04)',
        'paper-lg': '0 12px 32px -4px rgba(61, 53, 48, 0.1), 0 4px 12px -2px rgba(61, 53, 48, 0.05)',
        'notebook': 'inset 4px 0 12px rgba(61, 53, 48, 0.04), 0 8px 28px -4px rgba(42, 36, 33, 0.09)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(0.97)' },
        }
      }
    },
  },
  plugins: [],
}
