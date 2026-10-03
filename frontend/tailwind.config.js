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
        cyber: {
          950: '#f8fafc', // Main page background (Slate 50)
          900: '#ffffff', // Cards / containers (Pure White)
          850: '#f1f5f9', // Inner panels / secondary surface (Slate 100)
          800: '#e2e8f0', // Borders & dividers (Slate 200)
          700: '#cbd5e1', // Hover borders / subtle inputs (Slate 300)
          600: '#64748b', // Muted slate text (Slate 500)
          500: '#2563eb', // Vibrant primary blue
          400: '#0284c7', // Cyan / Sky primary accent
          accent: '#0284c7', // cyan-600
          neon: '#059669',   // emerald-600
          warning: '#d97706',// amber-600
          danger: '#dc2626', // red-600
          purple: '#7c3aed'  // violet-600
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 4px 20px -2px rgba(2, 132, 199, 0.18)',
        'glow-blue': '0 4px 25px -2px rgba(37, 99, 235, 0.18)',
        'glow-red': '0 4px 20px -2px rgba(220, 38, 38, 0.18)',
        'glow-emerald': '0 4px 20px -2px rgba(5, 150, 105, 0.18)',
        'cyber-card': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(2, 132, 199, 0.15)' },
          '100%': { boxShadow: '0 0 25px rgba(2, 132, 199, 0.35)' },
        }
      }
    },
  },
  plugins: [],
}
