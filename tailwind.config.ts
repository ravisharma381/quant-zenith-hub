import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				purple: {
					DEFAULT: 'hsl(var(--purple))',
					foreground: 'hsl(var(--purple-foreground))',
					glow: 'hsl(var(--purple-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-purple': 'var(--gradient-purple)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-dark': 'var(--gradient-dark)',
				'gradient-accent': 'var(--gradient-accent)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'purple-glow': 'var(--shadow-purple-glow)',
				'card': 'var(--shadow-card)'
			},
			transitionProperty: {
				'smooth': 'var(--transition-smooth)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(122 97% 50% / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px hsl(122 97% 50% / 0.6)'
					}
				},
			'shake': {
					'0%, 100%': {
						transform: 'translateX(0)'
					},
					'10%, 30%, 50%, 70%, 90%': {
						transform: 'translateX(-4px)'
					},
					'20%, 40%, 60%, 80%': {
						transform: 'translateX(4px)'
					}
				},
				'grid-float-1': {
					'0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
					'25%': { transform: 'translate(8px, -6px) scale(1.05)', opacity: '0.7' },
					'50%': { transform: 'translate(-4px, 10px) scale(0.97)', opacity: '0.3' },
					'75%': { transform: 'translate(6px, 4px) scale(1.03)', opacity: '0.6' },
				},
				'grid-float-2': {
					'0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.3' },
					'30%': { transform: 'translate(-10px, 8px) scale(1.06)', opacity: '0.6' },
					'60%': { transform: 'translate(6px, -10px) scale(0.95)', opacity: '0.5' },
				},
				'grid-float-3': {
					'0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.5' },
					'40%': { transform: 'translate(5px, 12px) scale(1.08)', opacity: '0.3' },
					'80%': { transform: 'translate(-8px, -5px) scale(0.96)', opacity: '0.7' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'shake': 'shake 0.5s ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;