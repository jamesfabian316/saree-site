import { Component, ErrorInfo, ReactNode } from 'react'
import { Typography, Button, Box, Paper } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RefreshIcon from '@mui/icons-material/Refresh'

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
	error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	}

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo)
	}

	public render() {
		if (this.state.hasError) {
			return (
				<Box display='flex' alignItems='center' justifyContent='center' minHeight='80vh' px={3}>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							borderRadius: 4,
							textAlign: 'center',
							maxWidth: 500,
							border: '1px solid',
							borderColor: 'divider',
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								height: '4px',
								background: (theme) => `linear-gradient(90deg, 
									${alpha(theme.palette.error.main, 0.7)} 0%, 
									${alpha(theme.palette.error.light, 0.7)} 100%)`,
							},
						}}
					>
						<Box
							sx={{
								width: 80,
								height: 80,
								borderRadius: '50%',
								bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								mx: 'auto',
								mb: 3,
							}}
						>
							<ErrorOutlineIcon
								sx={{
									fontSize: 40,
									color: 'error.main',
								}}
							/>
						</Box>

						<Typography variant='h5' gutterBottom fontWeight='bold' color='error'>
							Something went wrong
						</Typography>

						<Typography color='text.secondary' sx={{ mb: 4 }}>
							{this.state.error?.message || 'An unexpected error occurred'}
						</Typography>

						<Button
							variant='contained'
							color='primary'
							onClick={() => window.location.reload()}
							startIcon={<RefreshIcon />}
							sx={{
								borderRadius: 8,
								px: 4,
								py: 1.5,
								boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
								'&:hover': {
									boxShadow: (theme) => `0 12px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
								},
							}}
						>
							Reload Page
						</Button>
					</Paper>
				</Box>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
