import React, { useState, useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import { Product } from '../types'
import { config } from '../config'
import {
	Container,
	Grid,
	Typography,
	Button,
	Box,
	Chip,
	Divider,
	Paper,
	CircularProgress,
	Alert,
	IconButton,
	Breadcrumbs,
	Link,
	Stack,
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'

interface ProductPageProps {
	addToCart: (product: Product) => void
	addToWishlist: (product: Product) => void
	isInWishlist: (productId: number) => boolean
}

const ProductPage: React.FC<ProductPageProps> = ({ addToCart, addToWishlist, isInWishlist }) => {
	const { id } = useParams<{ id: string }>()
	const [product, setProduct] = useState<Product | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true)
				const response = await axios.get(`${config.API_URL}/api/products/${id}`)
				console.log('Product details:', response.data) // Debug log
				setProduct(response.data)
			} catch (err) {
				setError('Failed to fetch product details')
				console.error('Error fetching product:', err)
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchProduct()
		}
	}, [id])

	if (loading) {
		return (
			<Container maxWidth='lg' sx={{ py: 8 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '50vh',
					}}
				>
					<CircularProgress color='primary' />
				</Box>
			</Container>
		)
	}

	if (error) {
		return (
			<Container maxWidth='lg' sx={{ py: 8 }}>
				<Alert severity='error' sx={{ mb: 4 }}>
					{error}
				</Alert>
			</Container>
		)
	}

	if (!product) {
		return (
			<Container maxWidth='lg' sx={{ py: 8 }}>
				<Alert severity='warning' sx={{ mb: 4 }}>
					Product not found
				</Alert>
			</Container>
		)
	}

	// Format the image URL correctly
	const imageUrl = product.image.startsWith('http')
		? product.image
		: `${config.API_URL}${product.image}`

	const discountedPrice = product.discount
		? product.price - (product.price * product.discount) / 100
		: product.price

	const inWishlist = isInWishlist(product.id)

	return (
		<Container maxWidth='lg' sx={{ py: 4 }}>
			{/* Breadcrumbs */}
			<Breadcrumbs
				separator={<NavigateNextIcon fontSize='small' />}
				aria-label='breadcrumb'
				sx={{ mb: 4 }}
			>
				<Link
					component={RouterLink}
					to='/'
					color='inherit'
					sx={{
						display: 'flex',
						alignItems: 'center',
						textDecoration: 'none',
						'&:hover': {
							textDecoration: 'underline',
						},
					}}
				>
					<HomeIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
					Home
				</Link>
				<Typography color='text.primary'>{product.name}</Typography>
			</Breadcrumbs>

			<Grid container spacing={4}>
				<Grid item xs={12} md={6}>
					<Paper
						elevation={3}
						sx={{
							borderRadius: 4,
							overflow: 'hidden',
							position: 'relative',
							height: '100%',
							border: '1px solid rgba(255,77,143,0.15)',
							boxShadow: '0 10px 30px rgba(0,0,0,0.08), 0 6px 10px rgba(0,0,0,0.05)',
							transition: 'all 0.3s ease-in-out',
							'&:hover': {
								boxShadow: '0 15px 35px rgba(255,77,143,0.1), 0 8px 12px rgba(0,0,0,0.08)',
								transform: 'translateY(-5px)',
							},
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								width: 100,
								height: 100,
								background:
									'radial-gradient(circle at top left, rgba(255,77,143,0.15) 0%, rgba(255,255,255,0) 70%)',
								borderTopLeftRadius: 16,
								zIndex: 1,
								pointerEvents: 'none',
							},
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: 0,
								right: 0,
								width: 100,
								height: 100,
								background:
									'radial-gradient(circle at bottom right, rgba(156,39,176,0.15) 0%, rgba(255,255,255,0) 70%)',
								borderBottomRightRadius: 16,
								zIndex: 1,
								pointerEvents: 'none',
							},
						}}
					>
						<Box
							sx={{
								position: 'relative',
								height: '100%',
								overflow: 'hidden',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									background:
										'linear-gradient(135deg, rgba(255,77,143,0.03) 0%, rgba(156,39,176,0.03) 100%)',
									zIndex: 2,
									opacity: 0,
									transition: 'opacity 0.5s ease',
								},
								'&:hover::before': {
									opacity: 1,
								},
							}}
						>
							<Box
								component='img'
								src={imageUrl}
								alt={product.name}
								onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
									e.currentTarget.src =
										'https://via.placeholder.com/500x500?text=Image+Not+Available'
								}}
								sx={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									display: 'block',
									transition: 'transform 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
									filter: 'brightness(0.98)',
									'&:hover': {
										transform: 'scale(1.04)',
										filter: 'brightness(1.03)',
									},
								}}
							/>
						</Box>
					</Paper>
				</Grid>

				<Grid item xs={12} md={6}>
					<Box
						sx={{
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<Box sx={{ mb: 2 }}>
							<Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
								<Chip
									label={product.category}
									size='small'
									sx={{
										bgcolor: 'rgba(156,39,176,0.1)',
										color: 'secondary.main',
										fontWeight: 'medium',
										borderRadius: 1,
									}}
								/>
								{product.stock > 0 ? (
									<Chip
										label='In Stock'
										size='small'
										sx={{
											bgcolor: 'rgba(76,175,80,0.1)',
											color: '#4CAF50',
											fontWeight: 'medium',
											borderRadius: 1,
										}}
									/>
								) : (
									<Chip
										label='Out of Stock'
										size='small'
										sx={{
											bgcolor: 'rgba(244,67,54,0.1)',
											color: '#F44336',
											fontWeight: 'medium',
											borderRadius: 1,
										}}
									/>
								)}
							</Stack>

							<Typography
								variant='h4'
								component='h1'
								gutterBottom
								sx={{
									fontWeight: 700,
									color: 'text.primary',
								}}
							>
								{product.name}
							</Typography>
						</Box>

						<Box sx={{ mb: 3 }}>
							<Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 1 }}>
								<Typography
									variant='h4'
									sx={{
										fontWeight: 700,
										background: 'linear-gradient(45deg, #FF4D8F 30%, #FF758E 90%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
										textFillColor: 'transparent',
									}}
								>
									${discountedPrice.toFixed(2)}
								</Typography>

								{product.discount > 0 && (
									<>
										<Typography
											variant='h6'
											sx={{
												textDecoration: 'line-through',
												color: 'text.secondary',
												fontWeight: 400,
											}}
										>
											${product.price.toFixed(2)}
										</Typography>
										<Chip
											label={`${product.discount}% OFF`}
											size='small'
											sx={{
												background: 'linear-gradient(45deg, #FF4D8F 30%, #FF758E 90%)',
												color: 'white',
												fontWeight: 'bold',
												boxShadow: '0 2px 5px rgba(255,77,143,0.3)',
											}}
										/>
									</>
								)}
							</Stack>

							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									color: 'success.main',
									mb: 2,
								}}
							>
								<LocalShippingOutlinedIcon fontSize='small' sx={{ mr: 1, fontSize: '1rem' }} />
								<Typography variant='body2' sx={{ fontWeight: 500 }}>
									Free Shipping
								</Typography>
							</Box>
						</Box>

						<Divider sx={{ mb: 3 }} />

						<Typography variant='body1' sx={{ mb: 4, color: 'text.secondary' }}>
							{product.description}
						</Typography>

						<Box sx={{ mt: 'auto' }}>
							<Stack direction='row' spacing={2}>
								<Button
									variant='contained'
									size='large'
									startIcon={<AddShoppingCartIcon />}
									onClick={() => addToCart(product)}
									disabled={product.stock <= 0}
									sx={{
										flex: 1,
										py: 1.5,
										borderRadius: 3,
										background: 'linear-gradient(45deg, #FF4D8F 30%, #FF758E 90%)',
										boxShadow: '0 4px 10px rgba(255,77,143,0.25)',
										'&:hover': {
											boxShadow: '0 6px 15px rgba(255,77,143,0.35)',
										},
									}}
								>
									Add to Cart
								</Button>

								<IconButton
									aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
									onClick={() => addToWishlist(product)}
									sx={{
										border: '1px solid',
										borderColor: inWishlist ? 'error.main' : 'rgba(255,77,143,0.3)',
										borderRadius: 2,
										color: inWishlist ? 'error.main' : 'text.secondary',
										width: 56,
										height: 56,
										'&:hover': {
											bgcolor: 'rgba(255,77,143,0.05)',
										},
									}}
								>
									{inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
								</IconButton>
							</Stack>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Container>
	)
}

export default ProductPage
