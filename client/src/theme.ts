import { createTheme, alpha } from '@mui/material/styles'

// Define dark theme color palette
const colors = {
	jet: '#29292B',
	jetLight: '#363638',
	jetDark: '#1F1F21',
	taupe: '#C9C7BA',
	taupeLight: '#D5D3C8',
	taupeDark: '#B8B6A7',
}

export const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: colors.taupe,
			light: colors.taupeLight,
			dark: colors.taupeDark,
			contrastText: colors.jet,
		},
		secondary: {
			main: colors.jet,
			light: colors.jetLight,
			dark: colors.jetDark,
			contrastText: colors.taupe,
		},
		error: {
			main: '#FF5252',
			light: '#FF8A80',
		},
		warning: {
			main: '#FFC107',
			light: '#FFE082',
		},
		info: {
			main: '#81A1C1',
			light: '#88C0D0',
		},
		success: {
			main: '#A3BE8C',
			light: '#B9D2A9',
		},
		background: {
			default: colors.jet,
			paper: colors.jetLight,
		},
		text: {
			primary: colors.taupe,
			secondary: alpha(colors.taupe, 0.7),
		},
		divider: alpha(colors.taupe, 0.12),
		action: {
			active: colors.taupe,
			hover: alpha(colors.taupe, 0.08),
			selected: alpha(colors.taupe, 0.16),
			disabled: alpha(colors.taupe, 0.3),
			disabledBackground: alpha(colors.taupe, 0.12),
		},
	},
	typography: {
		fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontWeight: 800,
			fontSize: '2.5rem',
			letterSpacing: '-0.5px',
		},
		h2: {
			fontWeight: 700,
			fontSize: '2rem',
			letterSpacing: '-0.5px',
		},
		h3: {
			fontWeight: 600,
			fontSize: '1.75rem',
			letterSpacing: '-0.25px',
		},
		h4: {
			fontWeight: 600,
			fontSize: '1.5rem',
		},
		h5: {
			fontWeight: 600,
			fontSize: '1.25rem',
		},
		h6: {
			fontWeight: 600,
			fontSize: '1rem',
		},
		subtitle1: {
			fontWeight: 500,
			letterSpacing: '0.15px',
		},
		button: {
			textTransform: 'none',
			fontWeight: 600,
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: colors.jet,
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='${encodeURIComponent(
						colors.taupe
					)}' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
					backgroundAttachment: 'fixed',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 25,
					padding: '10px 24px',
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-3px)',
					},
				},
			},
			variants: [
				{
					props: { variant: 'contained' },
					style: {
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
						'&:hover': {
							boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
						},
					},
				},
			],
		},
		MuiPaper: {
			defaultProps: {
				elevation: 0,
			},
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					transition: 'all 0.3s ease',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					transition: 'transform 0.3s ease, box-shadow 0.3s ease',
					'&:hover': {
						transform: 'translateY(-5px)',
					},
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: 'outlined',
				size: 'small',
			},
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						borderRadius: 12,
					},
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					fontWeight: 600,
					transition: 'all 0.3s ease',
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-2px)',
					},
				},
			},
		},
		MuiAppBar: {
			defaultProps: {
				elevation: 0,
			},
			styleOverrides: {
				root: {
					borderBottom: `1px solid ${alpha(colors.taupe, 0.1)}`,
				},
			},
		},
		MuiPagination: {
			styleOverrides: {
				root: {
					button: {
						borderRadius: '50%',
					},
				},
			},
		},
		MuiCircularProgress: {
			styleOverrides: {
				root: {
					color: colors.taupe,
				},
			},
		},
		MuiBadge: {
			styleOverrides: {
				badge: {
					fontWeight: 'bold',
					backgroundColor: colors.taupe,
					color: colors.jet,
				},
			},
		},
	},
})
