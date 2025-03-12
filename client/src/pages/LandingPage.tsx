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

// Define the categories available in the application
const AVAILABLE_CATEGORIES = ['Silk', 'Cotton', 'Silk Cotton', 'Linen']

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
					<CircularProgress size={60} thickness={4} />
					<Typography variant='h6' sx={{ mt: 2, fontStyle: 'italic', color: 'primary.main' }}>
						Loading exquisite sarees...
					</Typography>
				</Box>
			</Container>
		)

	if (error)
		return (
			<Container maxWidth='lg' sx={{ py: 8 }}>
				<Paper
					elevation={3}
					sx={{
						p: 4,
						textAlign: 'center',
						borderRadius: 4,
						border: '1px solid rgba(255, 77, 143, 0.2)',
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
			{/* Hero Section with Decorative Elements */}
			<Box
				sx={{
					position: 'relative',
					height: '300px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					textAlign: 'center',
					mb: 6,
					overflow: 'hidden',
					borderRadius: 4,
					background:
						'linear-gradient(135deg, rgba(255,77,143,0.08) 0%, rgba(156,39,176,0.05) 100%)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background:
							'radial-gradient(circle at 20% 30%, rgba(255, 77, 143, 0.15) 0%, transparent 40%), ' +
							'radial-gradient(circle at 80% 70%, rgba(156, 39, 176, 0.1) 0%, transparent 40%)',
						zIndex: 0,
					},
				}}
			>
				<Typography
					variant='h2'
					component='h1'
					sx={{
						fontWeight: 800,
						mb: 2,
						background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						textFillColor: 'transparent',
						textShadow: '0 2px 10px rgba(255, 77, 143, 0.2)',
						position: 'relative',
						zIndex: 1,
					}}
				>
					Elegant Saree Collection
				</Typography>
				<Typography
					variant='h6'
					sx={{
						maxWidth: '700px',
						mb: 4,
						color: 'text.secondary',
						position: 'relative',
						zIndex: 1,
					}}
				>
					Discover our exquisite range of handcrafted sarees for every occasion
				</Typography>
			</Box>

			{/* Sale Banner */}
			<Paper
				elevation={0}
				sx={{
					p: 3,
					mb: 6,
					borderRadius: 4,
					background: 'linear-gradient(45deg, rgba(255,77,143,0.1) 0%, rgba(156,39,176,0.05) 100%)',
					position: 'relative',
					overflow: 'hidden',
					border: '1px dashed rgba(255,77,143,0.3)',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: -20,
						right: -20,
						width: 100,
						height: 100,
						borderRadius: '50%',
						background: 'rgba(255,77,143,0.1)',
					}}
				/>
				<Box
					sx={{
						position: 'absolute',
						bottom: -30,
						left: -30,
						width: 120,
						height: 120,
						borderRadius: '50%',
						background: 'rgba(156,39,176,0.1)',
					}}
				/>
				<Typography
					variant='h5'
					sx={{
						fontWeight: 700,
						mb: 1,
						position: 'relative',
						zIndex: 1,
					}}
				>
					Special Offer! 🎉
				</Typography>
				<Typography variant='body1' sx={{ position: 'relative', zIndex: 1 }}>
					Get up to 30% off on selected sarees. Limited time offer.
				</Typography>
			</Paper>

			{/* Filters Section */}
			<Paper
				elevation={0}
				sx={{
					p: 3,
					mb: 4,
					borderRadius: 4,
					background:
						'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
					border: '1px solid rgba(255,77,143,0.1)',
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						background:
							"url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23FF4D8F' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
						opacity: 0.5,
						zIndex: 0,
					},
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
							variant='outlined'
							size='small'
							type='number'
							value={filters.minPrice}
							onChange={(e) => handleFilterChange('minPrice', e.target.value)}
							InputProps={{
								startAdornment: (
									<Box component='span' sx={{ mr: 0.5 }}>
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
							variant='outlined'
							size='small'
							type='number'
							value={filters.maxPrice}
							onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
							InputProps={{
								startAdornment: (
									<Box component='span' sx={{ mr: 0.5 }}>
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
				<Typography variant='h6' sx={{ fontWeight: 600 }}>
					Our Collection
					<Chip
						label={`${pagination.total} items`}
						size='small'
						color='primary'
						sx={{ ml: 1, fontWeight: 600 }}
					/>
				</Typography>

				{filters.category && (
					<Chip
						label={`Category: ${filters.category}`}
						onDelete={() => handleFilterChange('category', '')}
						color='primary'
						variant='outlined'
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
