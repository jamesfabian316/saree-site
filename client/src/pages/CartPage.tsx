import { Link as RouterLink } from 'react-router-dom'
import {
	Typography,
	Button,
	Box,
	Container,
	Card,
	CardContent,
	Divider,
	Paper,
} from '@mui/material'
import CartItem from '../components/CartItem'
import { Product } from '../types'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'

interface CartPageProps {
	cartItems: Product[]
	removeFromCart: (productId: number) => void
	updateCartItemQuantity: (productId: number, quantity: number) => void
	clearCart: () => void
}

const CartPage = ({
	cartItems,
	removeFromCart,
	updateCartItemQuantity,
	clearCart,
}: CartPageProps) => {
	const total = cartItems.reduce((sum, item) => {
		const itemPrice = item.price - (item.price * item.discount) / 100
		const quantity = item.quantity || 1
		return sum + itemPrice * quantity
	}, 0)

	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			<Box
				sx={{
					position: 'relative',
					mb: 5,
					'&::before': {
						content: '""',
						position: 'absolute',
						top: -20,
						left: '5%',
						width: 40,
						height: 40,
						borderRadius: '50%',
						background: 'rgba(255, 77, 143, 0.08)',
						zIndex: -1,
					},
					'&::after': {
						content: '""',
						position: 'absolute',
						bottom: -30,
						right: '10%',
						width: 60,
						height: 60,
						borderRadius: '50%',
						background: 'rgba(156, 39, 176, 0.06)',
						zIndex: -1,
					},
				}}
			>
				<Typography
					variant='h4'
					component='h1'
					gutterBottom
					align='center'
					sx={{
						mb: 1,
						background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						textFillColor: 'transparent',
						fontWeight: 700,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 1,
					}}
				>
					<ShoppingCartIcon fontSize='large' sx={{ color: '#FF4D8F' }} />
					Your Shopping Cart
				</Typography>

				<Typography variant='subtitle1' align='center' color='text.secondary' sx={{ mb: 4 }}>
					{cartItems.length > 0
						? `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`
						: 'Your cart is waiting to be filled with beautiful sarees'}
				</Typography>
			</Box>

			{cartItems.length === 0 ? (
				<Paper
					elevation={0}
					sx={{
						textAlign: 'center',
						py: 6,
						px: 4,
						borderRadius: 4,
						background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,249,252,1) 100%)',
						border: '1px dashed rgba(255, 77, 143, 0.3)',
						position: 'relative',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							height: '5px',
							background:
								'linear-gradient(90deg, rgba(255,77,143,0) 0%, rgba(255,77,143,0.3) 50%, rgba(255,77,143,0) 100%)',
						},
					}}
				>
					<Box
						sx={{
							width: 80,
							height: 80,
							borderRadius: '50%',
							bgcolor: 'rgba(255, 77, 143, 0.08)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mx: 'auto',
							mb: 3,
						}}
					>
						<ShoppingCartIcon sx={{ fontSize: 40, color: 'rgba(255, 77, 143, 0.7)' }} />
					</Box>

					<Typography variant='h6' color='text.secondary' gutterBottom>
						Your cart is empty
					</Typography>

					<Typography color='text.secondary' sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
						Looks like you haven't added any sarees to your cart yet. Explore our collection to find
						your perfect match.
					</Typography>

					<Button
						component={RouterLink}
						to='/'
						variant='contained'
						color='primary'
						startIcon={<ShoppingBagIcon />}
						sx={{
							mt: 2,
							px: 4,
							py: 1.5,
						}}
					>
						Continue Shopping
					</Button>
				</Paper>
			) : (
				<>
					<Box sx={{ mb: 4 }}>
						{cartItems.map((item) => (
							<CartItem
								key={item.id}
								item={item}
								onRemove={() => removeFromCart(item.id)}
								onUpdateQuantity={(quantity) => updateCartItemQuantity(item.id, quantity)}
							/>
						))}
					</Box>

					<Card
						sx={{
							mt: 4,
							borderRadius: 3,
							overflow: 'hidden',
							position: 'relative',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								height: '4px',
								background: 'linear-gradient(90deg, #FF4D8F, #9C27B0)',
							},
						}}
					>
						<CardContent sx={{ p: 3 }}>
							<Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>
								Order Summary
							</Typography>

							<Box sx={{ my: 2 }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography variant='body2' color='text.secondary'>
										Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
									</Typography>
									<Typography variant='body2'>₹{total.toFixed(2)}</Typography>
								</Box>

								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography variant='body2' color='text.secondary'>
										Shipping
									</Typography>
									<Typography variant='body2' color='success.main'>
										Free
									</Typography>
								</Box>
							</Box>

							<Divider sx={{ my: 2 }} />

							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
								<Typography variant='h6'>Total</Typography>
								<Box>
									<Typography
										variant='h6'
										color='primary'
										sx={{
											fontWeight: 'bold',
											background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
											textFillColor: 'transparent',
										}}
									>
										₹{total.toFixed(2)}
									</Typography>
									<Typography variant='caption' color='text.secondary'>
										Including all taxes
									</Typography>
								</Box>
							</Box>

							<Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
								<Button
									variant='outlined'
									color='error'
									fullWidth
									onClick={clearCart}
									startIcon={<DeleteSweepIcon />}
								>
									Clear Cart
								</Button>
								<Button
									component={RouterLink}
									to='/checkout'
									variant='contained'
									color='primary'
									fullWidth
									startIcon={<ShoppingBagIcon />}
								>
									Proceed to Checkout
								</Button>
							</Box>
						</CardContent>
					</Card>
				</>
			)}
		</Container>
	)
}

export default CartPage
