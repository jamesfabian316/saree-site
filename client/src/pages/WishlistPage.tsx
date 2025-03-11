import React from 'react'
import {
	Typography,
	Box,
	Container,
	Grid,
	Paper,
	Button,
	Divider,
	Card,
	CardMedia,
	CardContent,
	IconButton,
	Stack,
} from '@mui/material'
import { Product } from '../types'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Link as RouterLink } from 'react-router-dom'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'

interface WishlistPageProps {
	wishlistItems: Product[]
	removeFromWishlist: (productId: number) => void
	addToCart: (product: Product) => void
}

const WishlistPage: React.FC<WishlistPageProps> = ({
	wishlistItems,
	removeFromWishlist,
	addToCart,
}) => {
	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			<Box
				sx={{
					position: 'relative',
					mb: 5,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{/* Decorative circles */}
				<Box
					sx={{
						position: 'absolute',
						width: 60,
						height: 60,
						borderRadius: '50%',
						background:
							'linear-gradient(135deg, rgba(255,77,143,0.1) 0%, rgba(156,39,176,0.05) 100%)',
						left: -20,
						top: -10,
						zIndex: -1,
					}}
				/>
				<Box
					sx={{
						position: 'absolute',
						width: 40,
						height: 40,
						borderRadius: '50%',
						background:
							'linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(255,77,143,0.05) 100%)',
						right: -10,
						bottom: -5,
						zIndex: -1,
					}}
				/>

				<FavoriteIcon
					sx={{
						color: 'error.main',
						fontSize: '2rem',
						mr: 2,
						animation: 'pulse 1.5s infinite',
						'@keyframes pulse': {
							'0%': {
								transform: 'scale(1)',
							},
							'50%': {
								transform: 'scale(1.1)',
							},
							'100%': {
								transform: 'scale(1)',
							},
						},
					}}
				/>
				<Typography
					variant='h4'
					component='h1'
					sx={{
						fontWeight: 700,
						textAlign: 'center',
						background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						textFillColor: 'transparent',
						mb: 0,
					}}
				>
					My Wishlist
				</Typography>
			</Box>

			{wishlistItems.length === 0 ? (
				<Paper
					elevation={0}
					sx={{
						p: 5,
						textAlign: 'center',
						borderRadius: 4,
						background:
							'linear-gradient(135deg, rgba(255,77,143,0.03) 0%, rgba(156,39,176,0.02) 100%)',
						border: '1px dashed rgba(255,77,143,0.2)',
					}}
				>
					<Box
						sx={{
							width: 80,
							height: 80,
							borderRadius: '50%',
							background: 'rgba(255,77,143,0.08)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							margin: '0 auto 20px',
						}}
					>
						<FavoriteIcon
							sx={{
								color: 'rgba(255,77,143,0.5)',
								fontSize: '2.5rem',
							}}
						/>
					</Box>
					<Typography variant='h5' gutterBottom sx={{ fontWeight: 600, color: '#555' }}>
						Your wishlist is empty
					</Typography>
					<Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
						Add items you love to your wishlist. Review them anytime and easily move them to the
						cart.
					</Typography>
					<Button
						component={RouterLink}
						to='/'
						variant='contained'
						color='primary'
						startIcon={<ShoppingBagIcon />}
						sx={{
							borderRadius: 3,
							py: 1.2,
							px: 3,
							background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
							boxShadow: '0 4px 10px rgba(255, 77, 143, 0.25)',
							'&:hover': {
								boxShadow: '0 6px 15px rgba(255, 77, 143, 0.35)',
							},
						}}
					>
						Explore Collection
					</Button>
				</Paper>
			) : (
				<>
					<Grid container spacing={3}>
						{wishlistItems.map((item) => {
							const discountedPrice = item.discount
								? item.price - (item.price * item.discount) / 100
								: item.price

							return (
								<Grid item xs={12} sm={6} md={4} key={item.id}>
									<Card
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											borderRadius: 4,
											overflow: 'hidden',
											transition: 'all 0.3s ease',
											position: 'relative',
											'&:hover': {
												transform: 'translateY(-5px)',
												boxShadow: '0 12px 20px rgba(255, 77, 143, 0.15)',
											},
											border: '1px solid rgba(255,77,143,0.1)',
										}}
									>
										{item.discount > 0 && (
											<Box
												sx={{
													position: 'absolute',
													top: 10,
													right: 10,
													bgcolor: 'error.main',
													color: 'white',
													fontWeight: 'bold',
													fontSize: '0.75rem',
													py: 0.5,
													px: 1,
													borderRadius: 1,
													zIndex: 1,
												}}
											>
												{item.discount}% OFF
											</Box>
										)}

										<CardMedia
											component='img'
											height='180'
											image={item.image}
											alt={item.name}
											sx={{
												objectFit: 'cover',
												transition: 'transform 0.5s ease',
												'&:hover': {
													transform: 'scale(1.05)',
												},
											}}
										/>

										<CardContent sx={{ flexGrow: 1, pb: 1 }}>
											<Typography
												variant='h6'
												component={RouterLink}
												to={`/product/${item.id}`}
												sx={{
													fontWeight: 600,
													mb: 1,
													textDecoration: 'none',
													color: 'text.primary',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													display: '-webkit-box',
													WebkitLineClamp: 1,
													WebkitBoxOrient: 'vertical',
													'&:hover': {
														color: 'primary.main',
													},
												}}
											>
												{item.name}
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
													height: '2.5em',
												}}
											>
												{item.description}
											</Typography>

											<Stack
												direction='row'
												justifyContent='space-between'
												alignItems='center'
												spacing={1}
											>
												<Box>
													{item.discount > 0 && (
														<Typography
															variant='body2'
															sx={{
																textDecoration: 'line-through',
																color: 'text.secondary',
															}}
														>
															₹{item.price.toFixed(2)}
														</Typography>
													)}
													<Typography
														variant='h6'
														sx={{
															fontWeight: 700,
															color: 'primary.main',
														}}
													>
														₹{discountedPrice.toFixed(2)}
													</Typography>
												</Box>

												<Stack direction='row' spacing={1}>
													<IconButton
														size='small'
														onClick={() => removeFromWishlist(item.id)}
														sx={{
															color: 'error.main',
															'&:hover': {
																bgcolor: 'rgba(255,77,143,0.1)',
															},
														}}
													>
														<DeleteOutlineIcon fontSize='small' />
													</IconButton>
													<IconButton
														size='small'
														onClick={() => addToCart(item)}
														sx={{
															color: 'primary.main',
															'&:hover': {
																bgcolor: 'rgba(255,77,143,0.1)',
															},
														}}
													>
														<ShoppingCartIcon fontSize='small' />
													</IconButton>
												</Stack>
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							)
						})}
					</Grid>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							mt: 5,
							pt: 3,
							borderTop: '1px dashed rgba(255,77,143,0.2)',
						}}
					>
						<Button
							component={RouterLink}
							to='/'
							variant='outlined'
							color='primary'
							sx={{
								borderRadius: 3,
								mr: 2,
								borderColor: 'rgba(255,77,143,0.5)',
								'&:hover': {
									borderColor: 'primary.main',
									bgcolor: 'rgba(255,77,143,0.05)',
								},
							}}
						>
							Continue Shopping
						</Button>
					</Box>
				</>
			)}
		</Container>
	)
}

export default WishlistPage
