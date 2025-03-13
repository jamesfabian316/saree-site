import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { Product } from '../types'
import { config } from '../config'
import {
	CircularProgress,
	Alert,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	TextField,
	Box,
	Typography,
	Button,
	Grid,
	Paper,
	Container,
	Chip,
} from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { alpha } from '@mui/material/styles'

// Define the categories available in the application
const AVAILABLE_CATEGORIES = ['Cotton', 'Silk', 'Linen', 'Wool', 'Polyester', 'Blends']

const LandingPage: React.FC<{
	addToCart: (product: Product) => void
	addToWishlist: (product: Product) => void
	isInWishlist: (productId: number) => boolean
}> = ({ addToCart, addToWishlist, isInWishlist }) => {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [categories, setCategories] = useState<string[]>(AVAILABLE_CATEGORIES)
	const [filters, setFilters] = useState({
		category: '',
		minPrice: '',
		maxPrice: '',
	})
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 12,
		total: 0,
		totalPages: 0,
	})

	// Fetch categories when component mounts
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get(`${config.API_URL}/api/categories`)
				if (response.data && response.data.length > 0) {
					setCategories(response.data)
				} else {
					// Fallback to predefined categories if API returns empty array
					setCategories(AVAILABLE_CATEGORIES)
				}
			} catch (err) {
				console.error('Error fetching categories:', err)
				// Fallback to predefined categories if API fails
				setCategories(AVAILABLE_CATEGORIES)
			}
		}
		fetchCategories()
	}, [])

	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true)
			const params = new URLSearchParams({
				page: pagination.page.toString(),
				limit: pagination.limit.toString(),
				...(filters.category && { category: filters.category }),
				...(filters.minPrice && { minPrice: filters.minPrice }),
				...(filters.maxPrice && { maxPrice: filters.maxPrice }),
			})

			const response = await axios.get(`${config.API_URL}/api/products?${params.toString()}`)
			setProducts(response.data.products)
			setPagination(response.data.pagination)
		} catch (err) {
			setError('Failed to fetch products')
			console.error('Error fetching products:', err)
		} finally {
			setLoading(false)
		}
	}, [filters, pagination.page, pagination.limit])

	useEffect(() => {
		fetchProducts()
	}, [fetchProducts])

	const handleFilterChange = (field: string, value: string) => {
		setFilters((prev) => ({ ...prev, [field]: value }))
		setPagination((prev) => ({ ...prev, page: 1 })) // Reset to first page when filters change
	}

	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }))
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	if (loading)
		return (
			<Container maxWidth='lg' sx={{ py: 8 }}>
				<Box
					display='flex'
					justifyContent='center'
					alignItems='center'
					minHeight='400px'
					flexDirection='column'
				>
					<CircularProgress size={60} thickness={4} color='primary' />
					<Typography variant='h6' sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
						Loading materials...
					</Typography>
				</Box>
			</Container>
		)

	if (error)
		return (
			<Container maxWidth='lg' sx={{ py: 8 }}>
				<Paper
					elevation={0}
					sx={{
						p: 4,
						textAlign: 'center',
						borderRadius: 4,
						border: '1px solid',
						borderColor: 'divider',
					}}
				>
					<Typography color='error' variant='h5' gutterBottom>
						{error}
					</Typography>
					<Button variant='contained' onClick={fetchProducts} sx={{ mt: 2 }}>
						Try Again
					</Button>
				</Paper>
			</Container>
		)

	return (
		<Container maxWidth='lg' sx={{ py: 4 }}>
			{/* Hero Section */}
			<Paper
				elevation={0}
				sx={{
					position: 'relative',
					minHeight: '400px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					textAlign: 'center',
					mb: 6,
					overflow: 'hidden',
					borderRadius: 4,
					bgcolor: 'background.paper',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: (theme) => `
							radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 40%),
							radial-gradient(circle at 80% 70%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 40%)
						`,
						zIndex: 0,
					},
				}}
			>
				<Typography
					variant='h1'
					component='h1'
					sx={{
						fontWeight: 800,
						fontSize: { xs: '2.5rem', md: '3.5rem' },
						mb: 3,
						position: 'relative',
						zIndex: 1,
						color: 'text.primary',
					}}
				>
					Premium Fabric Materials
				</Typography>
				<Typography
					variant='h5'
					sx={{
						maxWidth: '800px',
						mb: 4,
						color: 'text.secondary',
						position: 'relative',
						zIndex: 1,
						px: 2,
					}}
				>
					Source high-quality textile raw materials for your clothing manufacturing needs
				</Typography>
				<Box sx={{ position: 'relative', zIndex: 1, display: 'flex', gap: 2, mt: 2 }}>
					<Button variant='contained' size='large'>
						Explore Materials
					</Button>
					<Button variant='outlined' size='large'>
						Request Samples
					</Button>
				</Box>
			</Paper>

			{/* Features Grid */}
			<Grid container spacing={3} sx={{ mb: 6 }}>
				{[
					{
						title: 'Quality Assurance',
						description: 'Rigorous testing and certification for all materials',
						icon: '🏆',
					},
					{
						title: 'Bulk Orders',
						description: 'Competitive pricing for wholesale purchases',
						icon: '📦',
					},
					{
						title: 'Global Shipping',
						description: 'Worldwide delivery with tracking',
						icon: '🌍',
					},
					{
						title: 'Custom Solutions',
						description: 'Tailored materials for your specific needs',
						icon: '⚡',
					},
				].map((feature, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								height: '100%',
								bgcolor: 'background.paper',
								border: '1px solid',
								borderColor: 'divider',
								transition: 'all 0.3s ease',
								'&:hover': {
									transform: 'translateY(-5px)',
									boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`,
									borderColor: 'primary.main',
								},
							}}
						>
							<Typography variant='h2' sx={{ fontSize: '2rem', mb: 2 }}>
								{feature.icon}
							</Typography>
							<Typography
								variant='h6'
								sx={{
									mb: 1,
									color: 'text.primary',
									fontWeight: 600,
								}}
							>
								{feature.title}
							</Typography>
							<Typography
								variant='body2'
								sx={{
									color: 'text.secondary',
								}}
							>
								{feature.description}
							</Typography>
						</Paper>
					</Grid>
				))}
			</Grid>

			{/* Filters Section */}
			<Paper
				elevation={0}
				sx={{
					p: 3,
					mb: 4,
					borderRadius: 4,
					bgcolor: 'background.paper',
					border: '1px solid',
					borderColor: 'divider',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<Typography
					variant='h6'
					sx={{
						display: 'flex',
						alignItems: 'center',
						mb: 3,
						fontWeight: 600,
						color: 'text.primary',
					}}
				>
					<FilterAltIcon sx={{ mr: 1, color: 'primary.main' }} />
					Filter Collection
				</Typography>

				<Grid container spacing={3}>
					<Grid item xs={12} sm={4}>
						<FormControl fullWidth variant='outlined' size='small'>
							<InputLabel id='category-label'>Category</InputLabel>
							<Select
								labelId='category-label'
								id='category'
								value={filters.category}
								onChange={(e) => handleFilterChange('category', e.target.value)}
								label='Category'
							>
								<MenuItem value=''>
									<em>All Categories</em>
								</MenuItem>
								{categories.map((category) => (
									<MenuItem key={category} value={category}>
										{category}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							id='min-price'
							label='Min Price'
							type='number'
							value={filters.minPrice}
							onChange={(e) => handleFilterChange('minPrice', e.target.value)}
							InputProps={{
								startAdornment: (
									<Box component='span' sx={{ mr: 0.5, color: 'text.primary' }}>
										$
									</Box>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							id='max-price'
							label='Max Price'
							type='number'
							value={filters.maxPrice}
							onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
							InputProps={{
								startAdornment: (
									<Box component='span' sx={{ mr: 0.5, color: 'text.primary' }}>
										$
									</Box>
								),
							}}
						/>
					</Grid>
				</Grid>
			</Paper>

			{/* Product Count */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 4,
				}}
			>
				<Typography variant='h6' sx={{ fontWeight: 600, color: 'text.primary' }}>
					Our Collection
					<Chip
						label={`${pagination.total} items`}
						size='small'
						sx={{
							ml: 1,
							fontWeight: 600,
							bgcolor: 'background.paper',
							color: 'text.primary',
							border: '1px solid',
							borderColor: 'divider',
						}}
					/>
				</Typography>

				{filters.category && (
					<Chip
						label={`Category: ${filters.category}`}
						onDelete={() => handleFilterChange('category', '')}
						sx={{
							bgcolor: 'background.paper',
							color: 'text.primary',
							border: '1px solid',
							borderColor: 'divider',
							'& .MuiChip-deleteIcon': {
								color: 'text.secondary',
								'&:hover': {
									color: 'text.primary',
								},
							},
						}}
					/>
				)}
			</Box>

			{/* Product List */}
			{loading ? (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '200px',
					}}
				>
					<CircularProgress color='primary' />
				</Box>
			) : error ? (
				<Alert severity='error' sx={{ mb: 4 }}>
					{error}
				</Alert>
			) : (
				<>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 3,
						}}
					>
						<Typography variant='h6' component='h2' sx={{ fontWeight: 600 }}>
							{products.length > 0
								? `Showing ${products.length} of ${pagination.total} products`
								: 'No products found'}
						</Typography>
					</Box>

					<Grid container spacing={3}>
						{products.map((product) => (
							<Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
								<ProductCard
									product={product}
									addToCart={addToCart}
									addToWishlist={addToWishlist}
									isInWishlist={isInWishlist}
								/>
							</Grid>
						))}
					</Grid>

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mt: 5,
								gap: 1,
							}}
						>
							<Button
								variant='outlined'
								disabled={pagination.page === 1}
								onClick={() => handlePageChange(pagination.page - 1)}
								sx={{
									minWidth: '40px',
									height: '40px',
									p: 0,
									borderRadius: 2,
								}}
							>
								&lt;
							</Button>

							{[...Array(pagination.totalPages)].map((_, index) => (
								<Button
									key={index}
									variant={pagination.page === index + 1 ? 'contained' : 'outlined'}
									onClick={() => handlePageChange(index + 1)}
									sx={{
										minWidth: '40px',
										height: '40px',
										p: 0,
										borderRadius: 2,
									}}
								>
									{index + 1}
								</Button>
							))}

							<Button
								variant='outlined'
								disabled={pagination.page === pagination.totalPages}
								onClick={() => handlePageChange(pagination.page + 1)}
								sx={{
									minWidth: '40px',
									height: '40px',
									p: 0,
									borderRadius: 2,
								}}
							>
								&gt;
							</Button>
						</Box>
					)}
				</>
			)}
		</Container>
	)
}

export default LandingPage
