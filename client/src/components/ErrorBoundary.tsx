import { Component, ErrorInfo, ReactNode } from 'react'
import { Typography, Button, Box } from '@mui/material'

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
				<Box
					display='flex'
					flexDirection='column'
					alignItems='center'
					justifyContent='center'
					minHeight='400px'
				>
					<Typography variant='h5' gutterBottom>
						Something went wrong
					</Typography>
					<Typography color='text.secondary' gutterBottom>
						{this.state.error?.message}
					</Typography>
					<Button variant='contained' onClick={() => window.location.reload()}>
						Reload Page
					</Button>
				</Box>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
