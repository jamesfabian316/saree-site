import { createTheme } from '@mui/material/styles'

// Define a more vibrant color palette
const colors = {
	pink: {
		light: '#FF9EC6',
		main: '#FF4D8F',
		dark: '#E6297A',
		gradient: 'linear-gradient(45deg, #FF4D8F 30%, #FF85B3 90%)',
	},
	purple: {
		light: '#D6A4FF',
		main: '#9C27B0',
		dark: '#7B1FA2',
		gradient: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
	},
	coral: {
		light: '#FFB199',
		main: '#FF7E5F',
		dark: '#E65C41',
		gradient: 'linear-gradient(45deg, #FF7E5F 30%, #FFB199 90%)',
	},
	teal: {
		light: '#80DEEA',
		main: '#26C6DA',
		dark: '#00ACC1',
		gradient: 'linear-gradient(45deg, #26C6DA 30%, #80DEEA 90%)',
	},
	background: {
		light: '#FFF9FC',
		paper: '#FFFFFF',
		gradient: 'linear-gradient(135deg, #FFF9FC 0%, #FFF5FF 100%)',
	},
}

export const theme = createTheme({
	palette: {
		primary: {
			main: colors.pink.main,
			dark: colors.pink.dark,
			light: colors.pink.light,
			contrastText: '#ffffff',
		},
		secondary: {
			main: colors.purple.main,
			dark: colors.purple.dark,
			light: colors.purple.light,
			contrastText: '#ffffff',
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
			main: colors.teal.main,
			light: colors.teal.light,
		},
		success: {
			main: '#66BB6A',
			light: '#A5D6A7',
		},
		background: {
			default: colors.background.light,
			paper: colors.background.paper,
		},
		text: {
			primary: '#333333',
			secondary: '#666666',
		},
	},
	typography: {
		fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontWeight: 700,
			fontSize: '2.5rem',
			letterSpacing: '-0.5px',
			background: colors.pink.gradient,
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			backgroundClip: 'text',
			textFillColor: 'transparent',
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
					backgroundImage:
						'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23FF4D8F" fill-opacity="0.03" fill-rule="evenodd"/%3E%3C/svg%3E")',
					backgroundAttachment: 'fixed',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 25,
					textTransform: 'none',
					fontWeight: 600,
					padding: '10px 24px',
					boxShadow: '0 4px 12px rgba(255, 77, 143, 0.15)',
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-3px)',
						boxShadow: '0 6px 16px rgba(255, 77, 143, 0.25)',
					},
				},
				contained: {
					background: colors.pink.gradient,
					'&:hover': {
						background: colors.pink.gradient,
						filter: 'brightness(1.1)',
					},
				},
				containedSecondary: {
					background: colors.purple.gradient,
					'&:hover': {
						background: colors.purple.gradient,
						filter: 'brightness(1.1)',
					},
				},
				outlined: {
					borderWidth: 2,
					'&:hover': {
						borderWidth: 2,
					},
				},
				outlinedPrimary: {
					borderColor: colors.pink.main,
					'&:hover': {
						backgroundColor: 'rgba(255, 77, 143, 0.08)',
					},
				},
				outlinedSecondary: {
					borderColor: colors.purple.main,
					'&:hover': {
						backgroundColor: 'rgba(156, 39, 176, 0.08)',
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
					overflow: 'hidden',
					transition: 'transform 0.3s ease, box-shadow 0.3s ease',
					'&:hover': {
						transform: 'translateY(-5px)',
						boxShadow: '0 12px 28px rgba(255, 77, 143, 0.15)',
					},
					position: 'relative',
					'&::after': {
						content: '""',
						position: 'absolute',
						top: 0,
						right: 0,
						width: '100%',
						height: '5px',
						background: colors.pink.gradient,
						opacity: 0,
						transition: 'opacity 0.3s ease',
					},
					'&:hover::after': {
						opacity: 1,
					},
				},
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: {
					padding: 24,
					'&:last-child': {
						paddingBottom: 24,
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						borderRadius: 12,
						'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
							borderColor: colors.pink.main,
							borderWidth: 2,
						},
					},
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: '#E0E0E0',
					},
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: colors.pink.light,
					},
					'& .MuiInputLabel-root.Mui-focused': {
						color: colors.pink.main,
					},
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					fontWeight: 600,
				},
				colorPrimary: {
					background: colors.pink.gradient,
				},
				colorSecondary: {
					background: colors.purple.gradient,
				},
				colorSuccess: {
					backgroundColor: '#E5F7E5',
					color: '#2E7D32',
				},
				colorError: {
					background: 'linear-gradient(45deg, #FF5252 30%, #FF8A80 90%)',
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: 'rgba(255, 77, 143, 0.15)',
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
				},
				colorDefault: {
					backgroundColor: '#ffffff',
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
					color: colors.pink.main,
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
				},
				elevation1: {
					boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
				},
				elevation2: {
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
				},
				elevation3: {
					boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-2px)',
						backgroundColor: 'rgba(255, 77, 143, 0.08)',
					},
				},
			},
		},
		MuiBadge: {
			styleOverrides: {
				badge: {
					fontWeight: 'bold',
				},
			},
		},
	},
})
