import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
			
			// Primary Colors
			primary: 'var(--primary)',
			primaryOpacity: 'var(--primary-opacity)',
			primaryHover: 'var(--primary-hover)',
			'primary-dark': 'var(--primary-dark)',
			
			// Secondary Colors
			secondary: 'var(--secondary)',
			secondaryVariant: 'var(--secondary-variant)',
			
			// Tertiary Colors
			tertiary: 'var(--tertiary)',
			
			// Neutral Colors - Grays
			gray: 'var(--gray)',
			graySec: 'var(--gray-secondary)',
			lightGray: 'var(--gray-light)',
			lighterGray: 'var(--gray-lighter)',
			borderGray: 'var(--gray-border)',
			darkGray: 'var(--gray-dark)',
			grayBg: 'var(--gray-background)',
			
			// Text Colors
			textPrimary: 'var(--text-primary)',
			textSecondary: 'var(--text-secondary)',
			textMuted: 'var(--text-muted)',
			
			// Chart & Data Visualization Colors
			chartBlue: 'var(--chart-blue)',
			chartGreen: 'var(--chart-green)',
			chartGreenLight: 'var(--chart-green-light)',
			chartYellow: 'var(--chart-yellow)',
			chartPurple: 'var(--chart-purple)',
			chartRed: 'var(--chart-red)',
			
			// Base Colors
			white: 'var(--white)',
			black: 'var(--black)',
			
			// Opacity Variants
			black10: 'var(--black-10)',
			black33: 'var(--black-33)',
			black66: 'var(--black-66)',
			white70: 'var(--white-70)',
			whiteOpacity: 'var(--white-opacity)',
			borderOpacity: 'var(--border-opacity)',
			
			// Status Colors
			success: 'var(--success)',
			warning: 'var(--warning)',
			error: 'var(--error)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.w-93p-mx-auto': {
        width: '93%',
        marginLeft: 'auto',
        marginRight: 'auto',
        '@screen lg': {
          width: '90%',
        },
        '@screen 2xl': {
          width: '85%',
        }
        },
        '.w-90p-mx-auto': {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        },
        '.flex-itc': {
          display: 'flex',
          alignItems: 'center',
        },
        '.flex-itc-jub': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        },
        '.flex-itc-juc': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
      },
      tailwindcssAnimate
],
};
