import { Link as RouterLink } from 'react-router-dom'
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	Button,
	Box,
	Chip,
	Stack,
	IconButton,
	CardActions,
	Tooltip,
} from '@mui/material'
import { Product } from '../types'
import { config } from '../config'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'

interface ProductCardProps {
	product: Product
	addToCart: (product: Product) => void
	addToWishlist: (product: Product) => void
	isInWishlist: (productId: number) => boolean
}

const ProductCard = ({ product, addToCart, addToWishlist, isInWishlist }: ProductCardProps) => {
	const discountedPrice = product.discount
		? product.price - (product.price * product.discount) / 100
		: product.price

	const inWishlist = isInWishlist(product.id)

	// Format the image URL correctly
	let imageUrl = ''

	if (!product.image) {
		imageUrl = 'https://via.placeholder.com/500x500?text=No+Image+Available'
	} else if (product.image.startsWith('http')) {
		imageUrl = product.image
	} else if (product.image.startsWith('/images/')) {
		// If the path already includes /images/, just append to API_URL
		imageUrl = `${config.API_URL}${product.image}`
	} else {
		// Otherwise, add /images/ prefix
		imageUrl = `${config.API_URL}/images/${product.image}`
	}

	console.log('Product card image path:', product.image)
	console.log('Product card constructed URL:', imageUrl)

	return (
		<Card
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				overflow: 'visible',
				borderRadius: 4,
				transition: 'all 0.3s ease',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: -5,
					left: -5,
					right: -5,
					bottom: -5,
					borderRadius: 5,
					background:
						'linear-gradient(135deg, rgba(255,77,143,0.08) 0%, rgba(156,39,176,0.05) 100%)',
					zIndex: -1,
					opacity: 0,
					transition: 'opacity 0.3s ease',
				},
				'&:hover': {
					transform: 'translateY(-8px)',
					boxShadow: '0 16px 30px rgba(255, 77, 143, 0.15)',
					'&::before': {
						opacity: 1,
					},
				},
			}}
		>
			{product.discount > 0 && (
				<Chip
					label={`${product.discount}% OFF`}
					size='small'
					sx={{
						position: 'absolute',
						top: 12,
						right: 12,
						zIndex: 10,
						fontWeight: 'bold',
						background: 'linear-gradient(45deg, #FF4D8F 30%, #FF758E 90%)',
						boxShadow: '0 4px 8px rgba(255, 77, 143, 0.3)',
						color: 'white',
						fontSize: '0.75rem',
						height: 24,
					}}
				/>
			)}

			<Box
				sx={{
					position: 'relative',
					overflow: 'hidden',
					borderTopLeftRadius: 16,
					borderTopRightRadius: 16,
					boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '100%',
						background:
							'linear-gradient(to bottom, rgba(255,77,143,0.05) 0%, rgba(156,39,176,0.05) 100%)',
						zIndex: 1,
						opacity: 0,
						transition: 'opacity 0.3s ease',
					},
					'&:hover::before': {
						opacity: 1,
					},
					'&::after': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						background:
							'radial-gradient(circle at top left, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
						zIndex: 2,
						pointerEvents: 'none',
					},
				}}
			>
				<CardMedia
					component='img'
					height='280'
					image={imageUrl}
					alt={product.name}
					sx={{
						objectFit: 'cover',
						transition: 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
						filter: 'brightness(0.98)',
						'&:hover': {
							transform: 'scale(1.08)',
							filter: 'brightness(1.05)',
						},
					}}
				/>

				{/* Decorative corner accent */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: 60,
						height: 60,
						background:
							'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
						borderTopLeftRadius: 16,
						zIndex: 3,
						pointerEvents: 'none',
					}}
				/>

				{/* Bottom overlay with action buttons */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)',
						height: '50%',
						display: 'flex',
						alignItems: 'flex-end',
						opacity: 0,
						transition: 'all 0.4s ease',
						transform: 'translateY(10px)',
						zIndex: 4,
						'.MuiCard-root:hover &': {
							opacity: 1,
							transform: 'translateY(0)',
						},
					}}
				>
					<Stack
						direction='row'
						spacing={1}
						sx={{
							p: 1.5,
							width: '100%',
							justifyContent: 'center',
						}}
					>
						<Tooltip title='View Details'>
							<IconButton
								component={RouterLink}
								to={`/product/${product.id}`}
								aria-label='view details'
								size='small'
								sx={{
									bgcolor: 'rgba(255,255,255,0.95)',
									color: 'primary.main',
									width: 36,
									height: 36,
									transition: 'all 0.3s ease',
									'&:hover': {
										bgcolor: 'white',
										transform: 'translateY(-3px)',
										boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
									},
								}}
							>
								<VisibilityIcon fontSize='small' />
							</IconButton>
						</Tooltip>

						<Tooltip title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
							<IconButton
								aria-label={inWishlist ? 'remove from favorites' : 'add to favorites'}
								size='small'
								onClick={() => addToWishlist(product)}
								sx={{
									bgcolor: 'rgba(255,255,255,0.95)',
									color: 'error.main',
									width: 36,
									height: 36,
									transition: 'all 0.3s ease',
									'&:hover': {
										bgcolor: 'white',
										transform: 'translateY(-3px)',
										boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
									},
								}}
							>
								{inWishlist ? (
									<FavoriteIcon fontSize='small' />
								) : (
									<FavoriteBorderIcon fontSize='small' />
								)}
							</IconButton>
						</Tooltip>

						<Tooltip title='Add to Cart'>
							<IconButton
								aria-label='add to cart'
								size='small'
								onClick={() => addToCart(product)}
								sx={{
									bgcolor: 'rgba(255,255,255,0.95)',
									color: 'primary.main',
									width: 36,
									height: 36,
									transition: 'all 0.3s ease',
									'&:hover': {
										bgcolor: 'white',
										transform: 'translateY(-3px)',
										boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
									},
								}}
							>
								<AddShoppingCartIcon fontSize='small' />
							</IconButton>
						</Tooltip>
					</Stack>
				</Box>
			</Box>

			<CardContent sx={{ flexGrow: 1, pt: 2.5, pb: 1.5 }}>
				<Typography
					variant='h6'
					component='h3'
					gutterBottom
					sx={{
						fontWeight: 600,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						height: '3em',
						color: '#333',
						transition: 'color 0.3s ease',
						'&:hover': {
							background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							textFillColor: 'transparent',
						},
					}}
				>
					{product.name}
				</Typography>

				<Typography
					variant='body2'
					color='text.secondary'
					sx={{
						mb: 2,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						height: '3em',
						fontSize: '0.85rem',
						lineHeight: 1.5,
					}}
				>
					{product.description}
				</Typography>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mt: 'auto',
					}}
				>
					<Box>
						{product.discount > 0 ? (
							<>
								<Typography
									variant='h6'
									sx={{
										fontWeight: 700,
										color: 'primary.main',
										background: 'linear-gradient(45deg, #FF4D8F 30%, #FF758E 90%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
										textFillColor: 'transparent',
									}}
								>
									₹{discountedPrice.toFixed(2)}
								</Typography>
								<Typography
									variant='body2'
									sx={{
										textDecoration: 'line-through',
										color: 'text.secondary',
										ml: 1,
									}}
								>
									₹{product.price.toFixed(2)}
								</Typography>
							</>
						) : (
							<Typography
								variant='h6'
								component='span'
								sx={{
									fontWeight: 700,
									background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									textFillColor: 'transparent',
								}}
							>
								₹{product.price.toFixed(2)}
							</Typography>
						)}
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						{product.stock > 0 ? (
							<Chip
								size='small'
								label='In Stock'
								sx={{
									bgcolor: 'rgba(76, 175, 80, 0.1)',
									color: '#4CAF50',
									fontWeight: 'bold',
									fontSize: '0.7rem',
									height: 20,
									mr: 1,
								}}
							/>
						) : (
							<Chip
								size='small'
								label='Out of Stock'
								sx={{
									bgcolor: 'rgba(244, 67, 54, 0.1)',
									color: '#F44336',
									fontWeight: 'bold',
									fontSize: '0.7rem',
									height: 20,
									mr: 1,
								}}
							/>
						)}
					</Box>
				</Box>
			</CardContent>

			<CardActions
				sx={{
					p: 2,
					pt: 0,
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						color: 'text.secondary',
						fontSize: '0.75rem',
					}}
				>
					<LocalShippingOutlinedIcon fontSize='small' sx={{ mr: 0.5, fontSize: '1rem' }} />
					Free Shipping
				</Box>

				<Button
					variant='contained'
					size='small'
					onClick={() => addToCart(product)}
					disabled={product.stock <= 0}
					startIcon={<AddShoppingCartIcon />}
					sx={{
						borderRadius: 6,
						background: 'linear-gradient(45deg, #FF4D8F 30%, #FF758E 90%)',
						boxShadow: '0 4px 8px rgba(255, 77, 143, 0.25)',
						px: 2,
						py: 0.75,
						fontWeight: 'bold',
						'&:hover': {
							background: 'linear-gradient(45deg, #FF4D8F 30%, #FF758E 90%)',
							boxShadow: '0 6px 12px rgba(255, 77, 143, 0.35)',
						},
					}}
				>
					Add
				</Button>
			</CardActions>
		</Card>
	)
}

export default ProductCard
