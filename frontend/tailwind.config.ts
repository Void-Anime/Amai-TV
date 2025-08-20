import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          900: '#0B0B0F',
          800: '#111217',
        },
        surface: '#151722',
        stroke: '#2A2D3A',
        primary: {
          DEFAULT: '#E5484D',
          hover: '#cf4045',
        },
        secondary: '#F59E0B',
        text: {
          high: '#F5F6F8',
          dim: '#B4B7C2',
        },
        success: '#2ECC71',
        warning: '#F59F00',
        error: '#E03131',
      },
      borderRadius: {
        md: '8px',
        lg: '14px',
        xl: '20px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.3)',
        md: '0 6px 12px rgba(0,0,0,0.35)',
        lg: '0 14px 28px rgba(0,0,0,0.4)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config


