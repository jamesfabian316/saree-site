import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Product } from '../types'
import { config } from '../config'
import {
	Container,
	Typography,
	TextField,
	Button,
	Grid,
	Paper,
	Box,
	Stepper,
	Step,
	StepLabel,
	Divider,
	Card,
	CardContent,
	CircularProgress,
	Alert,
	Fade,
} from '@mui/material'
import {
	ShoppingBag as ShoppingBagIcon,
	CreditCard as CreditCardIcon,
	LocalShipping as LocalShippingIcon,
	Check as CheckIcon,
	ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'

interface CheckoutPageProps {
	cart: Product[]
	clearCart: () => void
}

interface FormData {
	firstName: string
	lastName: string
	email: string
	address: string
	city: string
	state: string
	zipCode: string
	cardName: string
	cardNumber: string
	expDate: string
	cvv: string
}

const steps = ['Shipping Information', 'Payment Details', 'Review Order']

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, clearCart }) => {
	const navigate = useNavigate()
	const [activeStep, setActiveStep] = useState(0)
	const [orderPlaced, setOrderPlaced] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [formData, setFormData] = useState<FormData>({
		firstName: '',
		lastName: '',
		email: '',
		address: '',
		city: '',
		state: '',
		zipCode: '',
		cardName: '',
		cardNumber: '',
		expDate: '',
		cvv: '',
	})

	const calculateTotal = () => {
		return cart.reduce((total, item) => {
			const price = item.discountPrice || item.price
			return total + price * (item.quantity || 1)
		}, 0)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1)
	}

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1)
	}

	const handleCheckout = async () => {
		if (cart.length === 0) {
			setError('Your cart is empty')
			return
		}

		setLoading(true)
		setError(null)

		try {
			const response = await axios.post(`${config.API_URL}/api/checkout`, {
				cart,
				shippingInfo: {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					address: formData.address,
					city: formData.city,
					state: formData.state,
					zipCode: formData.zipCode,
				},
				paymentInfo: {
					cardName: formData.cardName,
					cardNumber: formData.cardNumber,
					expDate: formData.expDate,
					cvv: formData.cvv,
				},
			})

			setOrderPlaced(true)
			clearCart()
			setActiveStep(3)
		} catch (err) {
			setError('An error occurred while processing your order. Please try again.')
			console.error('Checkout error:', err)
		} finally {
			setLoading(false)
		}
	}

	const getStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								label='First Name'
								name='firstName'
								value={formData.firstName}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								label='Last Name'
								name='lastName'
								value={formData.lastName}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								label='Email'
								name='email'
								type='email'
								value={formData.email}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								label='Address'
								name='address'
								value={formData.address}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								label='City'
								name='city'
								value={formData.city}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								fullWidth
								label='State'
								name='state'
								value={formData.state}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								fullWidth
								label='Zip Code'
								name='zipCode'
								value={formData.zipCode}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
					</Grid>
				)
			case 1:
				return (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								label='Name on Card'
								name='cardName'
								value={formData.cardName}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								label='Card Number'
								name='cardNumber'
								value={formData.cardNumber}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								label='Expiry Date (MM/YY)'
								name='expDate'
								value={formData.expDate}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								label='CVV'
								name='cvv'
								value={formData.cvv}
								onChange={handleInputChange}
								variant='outlined'
								sx={{ mb: 2 }}
							/>
						</Grid>
					</Grid>
				)
			case 2:
				return (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant='h6' gutterBottom>
								Order Summary
							</Typography>
							<Divider sx={{ mb: 2 }} />
							{cart.map((item) => (
								<Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Box
											component='img'
											src={item.imageUrl}
											alt={item.name}
											sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
										/>
										<Box>
											<Typography variant='body1'>{item.name}</Typography>
											<Typography variant='body2' color='text.secondary'>
												Quantity: {item.quantity || 1}
											</Typography>
										</Box>
									</Box>
									<Typography variant='body1'>
										₹{((item.discountPrice || item.price) * (item.quantity || 1)).toFixed(2)}
									</Typography>
								</Box>
							))}
							<Divider sx={{ my: 2 }} />
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant='body1'>Subtotal</Typography>
								<Typography variant='body1'>₹{calculateTotal().toFixed(2)}</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant='body1'>Shipping</Typography>
								<Typography variant='body1' color='success.main'>
									Free
								</Typography>
							</Box>
							<Divider sx={{ my: 2 }} />
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant='h6'>Total</Typography>
								<Typography
									variant='h6'
									sx={{
										fontWeight: 'bold',
										background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
									}}
								>
									₹{calculateTotal().toFixed(2)}
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Typography variant='h6' gutterBottom>
								Shipping Information
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Typography variant='body1'>
								{formData.firstName} {formData.lastName}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{formData.address}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{formData.city}, {formData.state} {formData.zipCode}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{formData.email}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant='h6' gutterBottom>
								Payment Details
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Typography variant='body1'>{formData.cardName}</Typography>
							<Typography variant='body2' color='text.secondary'>
								Card ending in {formData.cardNumber.slice(-4)}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								Expires {formData.expDate}
							</Typography>
						</Grid>
					</Grid>
				)
			default:
				return 'Unknown step'
		}
	}

	if (cart.length === 0 && !orderPlaced) {
		return (
			<Container maxWidth='md' sx={{ py: 8 }}>
				<Paper
					elevation={3}
					sx={{
						p: 4,
						borderRadius: 2,
						bgcolor: 'background.paper',
						border: '1px solid',
						borderColor: 'divider',
						position: 'relative',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: -50,
							right: -50,
							width: 150,
							height: 150,
							borderRadius: '50%',
							background: (theme) =>
								`radial-gradient(circle, ${alpha(
									theme.palette.primary.main,
									0.1
								)} 0%, transparent 70%)`,
						},
						'&::after': {
							content: '""',
							position: 'absolute',
							bottom: -30,
							left: -30,
							width: 100,
							height: 100,
							borderRadius: '50%',
							background: (theme) =>
								`radial-gradient(circle, ${alpha(
									theme.palette.secondary.main,
									0.1
								)} 0%, transparent 70%)`,
						},
					}}
				>
					<Box
						sx={{
							width: 80,
							height: 80,
							borderRadius: '50%',
							bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mx: 'auto',
							mb: 3,
						}}
					>
						<ShoppingBagIcon
							sx={{
								fontSize: 40,
								color: (theme) => alpha(theme.palette.primary.main, 0.7),
							}}
						/>
					</Box>

					<Typography
						variant='h4'
						gutterBottom
						sx={{
							fontWeight: 'bold',
							color: 'primary.main',
						}}
					>
						Your Cart is Empty
					</Typography>
					<Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
						Add some beautiful sarees to your cart before proceeding to checkout.
					</Typography>
					<Button
						variant='contained'
						color='primary'
						size='large'
						onClick={() => navigate('/')}
						startIcon={<ArrowBackIcon />}
						sx={{
							borderRadius: 8,
							px: 4,
							py: 1.5,
						}}
					>
						Continue Shopping
					</Button>
				</Paper>
			</Container>
		)
	}

	if (orderPlaced) {
		return (
			<Container maxWidth='md' sx={{ py: 8 }}>
				<Fade in={true} timeout={1000}>
					<Paper
						elevation={3}
						sx={{
							p: 4,
							borderRadius: 2,
							bgcolor: 'background.paper',
							border: '1px solid',
							borderColor: 'divider',
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: -50,
								right: -50,
								width: 150,
								height: 150,
								borderRadius: '50%',
								background: (theme) =>
									`radial-gradient(circle, ${alpha(
										theme.palette.primary.main,
										0.1
									)} 0%, transparent 70%)`,
							},
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: -30,
								left: -30,
								width: 100,
								height: 100,
								borderRadius: '50%',
								background: (theme) =>
									`radial-gradient(circle, ${alpha(
										theme.palette.secondary.main,
										0.1
									)} 0%, transparent 70%)`,
							},
						}}
					>
						<Box
							sx={{
								width: 80,
								height: 80,
								borderRadius: '50%',
								bgcolor: 'primary.main',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto',
								mb: 3,
								boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
							}}
						>
							<CheckIcon sx={{ fontSize: 40, color: 'primary.contrastText' }} />
						</Box>
						<Typography
							variant='h4'
							gutterBottom
							sx={{
								fontWeight: 'bold',
								color: 'primary.main',
							}}
						>
							Order Placed Successfully!
						</Typography>
						<Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
							Thank you for your purchase. Your order has been received and is being processed.
						</Typography>
						<Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
							A confirmation email has been sent to {formData.email}
						</Typography>
						<Button
							variant='contained'
							color='primary'
							size='large'
							onClick={() => navigate('/')}
							startIcon={<ArrowBackIcon />}
							sx={{
								borderRadius: 8,
								px: 4,
								py: 1.5,
							}}
						>
							Continue Shopping
						</Button>
					</Paper>
				</Fade>
			</Container>
		)
	}

	return (
		<Container maxWidth='lg' sx={{ py: 4 }}>
			<Paper
				elevation={3}
				sx={{
					p: 4,
					borderRadius: 2,
					bgcolor: 'background.paper',
					border: '1px solid',
					borderColor: 'divider',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: -50,
						right: -50,
						width: 150,
						height: 150,
						borderRadius: '50%',
						background:
							'radial-gradient(circle, rgba(255, 77, 143, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
					}}
				/>
				<Box
					sx={{
						position: 'absolute',
						bottom: -30,
						left: -30,
						width: 100,
						height: 100,
						borderRadius: '50%',
						background:
							'radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
					}}
				/>

				<Typography
					variant='h4'
					gutterBottom
					sx={{
						fontWeight: 'bold',
						mb: 4,
						display: 'flex',
						alignItems: 'center',
						background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}
				>
					<ShoppingBagIcon sx={{ mr: 1 }} /> Checkout
				</Typography>

				{error && (
					<Alert severity='error' sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				<Stepper activeStep={activeStep} sx={{ mb: 4 }}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				<Grid container spacing={4}>
					<Grid item xs={12} md={8}>
						<Card
							elevation={2}
							sx={{
								mb: 3,
								borderRadius: 2,
								border: '1px solid rgba(255, 77, 143, 0.2)',
								transition: 'all 0.3s ease',
								'&:hover': {
									boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
								},
							}}
						>
							<CardContent sx={{ p: 3 }}>{getStepContent(activeStep)}</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} md={4}>
						<Card
							elevation={2}
							sx={{
								borderRadius: 2,
								border: '1px solid rgba(255, 77, 143, 0.2)',
								position: 'sticky',
								top: 24,
								transition: 'all 0.3s ease',
								'&:hover': {
									boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
								},
							}}
						>
							<CardContent>
								<Typography variant='h6' gutterBottom>
									Order Summary
								</Typography>
								<Divider sx={{ mb: 2 }} />

								<Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
									{cart.map((item) => (
										<Box
											key={item.id}
											sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
										>
											<Typography variant='body2' noWrap sx={{ maxWidth: '70%' }}>
												{item.name} (x{item.quantity || 1})
											</Typography>
											<Typography variant='body2'>
												₹{((item.discountPrice || item.price) * (item.quantity || 1)).toFixed(2)}
											</Typography>
										</Box>
									))}
								</Box>

								<Divider sx={{ mb: 2 }} />

								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography variant='body2'>Subtotal</Typography>
									<Typography variant='body2'>₹{calculateTotal().toFixed(2)}</Typography>
								</Box>

								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography variant='body2'>Shipping</Typography>
									<Typography variant='body2' color='success.main'>
										Free
									</Typography>
								</Box>

								<Divider sx={{ my: 2 }} />

								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
									<Typography variant='h6'>Total</Typography>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 'bold',
											background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
										}}
									>
										₹{calculateTotal().toFixed(2)}
									</Typography>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
					<Button
						disabled={activeStep === 0}
						onClick={handleBack}
						variant='outlined'
						startIcon={<ArrowBackIcon />}
						sx={{ borderRadius: 8, px: 3 }}
					>
						Back
					</Button>

					{activeStep === steps.length - 1 ? (
						<Button
							variant='contained'
							color='primary'
							onClick={handleCheckout}
							disabled={loading}
							endIcon={loading ? <CircularProgress size={20} color='inherit' /> : <CheckIcon />}
							sx={{
								borderRadius: 8,
								px: 4,
								py: 1.5,
								boxShadow: '0 8px 16px rgba(255, 77, 143, 0.2)',
							}}
						>
							{loading ? 'Processing...' : 'Place Order'}
						</Button>
					) : (
						<Button
							variant='contained'
							color='primary'
							onClick={handleNext}
							sx={{
								borderRadius: 8,
								px: 4,
								py: 1.5,
								boxShadow: '0 8px 16px rgba(255, 77, 143, 0.2)',
							}}
						>
							Next
						</Button>
					)}
				</Box>
			</Paper>
		</Container>
	)
}

export default CheckoutPage
