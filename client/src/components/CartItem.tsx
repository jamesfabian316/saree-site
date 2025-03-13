import {
	Card,
	CardContent,
	Typography,
	IconButton,
	Box,
	TextField,
	CardMedia,
	Stack,
	Button,
	Divider,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { Product } from '../types'

interface CartItemProps {
	item: Product
	onRemove: () => void
	onUpdateQuantity: (quantity: number) => void
}

const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
	const discountedPrice = item.price - (item.price * item.discount) / 100
	const quantity = item.quantity || 1

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity > 0 && newQuantity <= item.stock) {
			onUpdateQuantity(newQuantity)
		}
	}

	return (
		<Card
			sx={{
				mb: 2,
				overflow: 'visible',
				borderRadius: 3,
				border: '1px solid',
				borderColor: 'divider',
				position: 'relative',
				transition: 'transform 0.3s ease, box-shadow 0.3s ease',
				'&:hover': {
					transform: 'translateY(-3px)',
					boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
				},
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					width: '6px',
					height: '100%',
					background: (theme) => `linear-gradient(to bottom, 
						${theme.palette.primary.main}, 
						${theme.palette.secondary.main})`,
					borderTopLeftRadius: 12,
					borderBottomLeftRadius: 12,
				},
			}}
		>
			<CardContent
				sx={{
					display: 'flex',
					gap: 3,
					alignItems: 'center',
					p: 3,
					'&:last-child': { pb: 3 },
				}}
			>
				<Box
					sx={{
						position: 'relative',
						width: 120,
						height: 120,
						borderRadius: 2,
						overflow: 'hidden',
						boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
					}}
				>
					<CardMedia
						component='img'
						sx={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							transition: 'transform 0.5s ease',
							'&:hover': {
								transform: 'scale(1.08)',
							},
						}}
						image={item.image}
						alt={item.name}
					/>
					{item.discount > 0 && (
						<Box
							sx={{
								position: 'absolute',
								bottom: 0,
								right: 0,
								bgcolor: 'error.main',
								color: 'error.contrastText',
								px: 1,
								py: 0.5,
								fontSize: '0.75rem',
								fontWeight: 'bold',
								borderTopLeftRadius: 8,
							}}
						>
							{item.discount}% OFF
						</Box>
					)}
				</Box>

				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Typography
						variant='h6'
						gutterBottom
						sx={{
							fontWeight: 600,
							color: 'text.primary',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{item.name}
					</Typography>

					<Typography
						variant='body2'
						color='text.secondary'
						sx={{
							mb: 1,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							height: '2.6em',
						}}
					>
						{item.description}
					</Typography>

					<Stack direction='row' alignItems='center' spacing={1}>
						<Typography variant='h6' color='primary' fontWeight='bold'>
							₹{discountedPrice.toFixed(2)}
						</Typography>

						{item.discount > 0 && (
							<Typography
								variant='body2'
								color='text.secondary'
								sx={{ textDecoration: 'line-through' }}
							>
								₹{item.price.toFixed(2)}
							</Typography>
						)}
					</Stack>
				</Box>

				<Divider orientation='vertical' flexItem sx={{ mx: 1 }} />

				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
					<Stack direction='row' alignItems='center' spacing={1}>
						<IconButton
							size='small'
							onClick={() => handleQuantityChange(quantity - 1)}
							disabled={quantity <= 1}
							sx={{
								bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
								color: 'primary.main',
								'&:hover': {
									bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
								},
								'&.Mui-disabled': {
									bgcolor: (theme) => alpha(theme.palette.action.disabled, 0.08),
								},
							}}
						>
							<RemoveIcon fontSize='small' />
						</IconButton>

						<TextField
							type='number'
							size='small'
							value={quantity}
							InputProps={{
								inputProps: {
									min: 1,
									max: item.stock,
									style: { textAlign: 'center' },
								},
								sx: {
									width: 60,
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
									},
								},
							}}
							onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
						/>

						<IconButton
							size='small'
							onClick={() => handleQuantityChange(quantity + 1)}
							disabled={quantity >= item.stock}
							sx={{
								bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
								color: 'primary.main',
								'&:hover': {
									bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
								},
								'&.Mui-disabled': {
									bgcolor: (theme) => alpha(theme.palette.action.disabled, 0.08),
								},
							}}
						>
							<AddIcon fontSize='small' />
						</IconButton>
					</Stack>

					<Button
						startIcon={<DeleteIcon />}
						onClick={onRemove}
						color='error'
						variant='outlined'
						size='small'
						sx={{
							borderRadius: 6,
							minWidth: 120,
							mt: 1,
							borderColor: (theme) => alpha(theme.palette.error.main, 0.5),
							'&:hover': {
								borderColor: 'error.main',
								bgcolor: (theme) => alpha(theme.palette.error.main, 0.04),
							},
						}}
					>
						Remove
					</Button>
				</Box>
			</CardContent>
		</Card>
	)
}

export default CartItem
