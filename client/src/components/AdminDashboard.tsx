import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { config } from '../config'
import {
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Paper,
	Typography,
	Box,
	FormHelperText,
	Tooltip,
	CircularProgress,
	Fade,
	Chip,
	IconButton,
	InputAdornment,
	Skeleton,
	Alert,
	Snackbar,
} from '@mui/material'
import {
	CloudUpload as CloudUploadIcon,
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Save as SaveIcon,
	Sort as SortIcon,
	FilterList as FilterIcon,
	Search as SearchIcon,
} from '@mui/icons-material'

interface Product {
	id: number
	name: string
	price: number
	discount: number
	category: string
	image: string
	description: string
	stock: number
}

interface ProductForm {
	name: string
	price: number
	discount: number
	category: string
	description: string
	stock: number
	image?: FileList
}

// Define the categories available in the application
const AVAILABLE_CATEGORIES = ['Silk', 'Cotton', 'Silk Cotton', 'Linen']

const AdminDashboard = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		control,
	} = useForm<ProductForm>({
		defaultValues: {
			name: '',
			price: 0,
			discount: 0,
			category: '',
			description: '',
			stock: 0,
		},
	})
	const [message, setMessage] = useState('')
	const [previewImage, setPreviewImage] = useState<string>()
	const [selectedFile, setSelectedFile] = useState<File>()
	const [products, setProducts] = useState<Product[]>([])
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)

	// Add sorting function
	const [sortOrder, setSortOrder] = useState('asc')
	const [filterCategory, setFilterCategory] = useState('')
	const [searchQuery, setSearchQuery] = useState('')
	const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
	const [loadingStates, setLoadingStates] = useState({
		products: true,
		submit: false,
		delete: null as number | null,
	})

	// Add statistics state
	const [statistics, setStatistics] = useState({
		totalProducts: 0,
		totalCategories: 0,
		lowStockProducts: 0,
		discountedProducts: 0,
	})

	const fetchProducts = async () => {
		setLoadingStates((prev) => ({ ...prev, products: true }))
		try {
			const response = await axios.get(`${config.API_URL}/api/products`)
			console.log('Products fetched:', response.data) // Debug log
			console.log('First product category:', response.data.products[0]?.category)
			setProducts(response.data.products)
		} catch (error) {
			console.error('Error fetching products:', error)
			setMessage('Error loading products')
		} finally {
			setLoadingStates((prev) => ({ ...prev, products: false }))
		}
	}

	useEffect(() => {
		fetchProducts()
	}, [])

	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				setMessage('')
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [message])

	useEffect(() => {
		if (editingProduct) {
			// When entering edit mode, populate the form with product data
			console.log('Populating form with editing product data:', editingProduct)
			console.log('Category from editing product:', editingProduct.category)

			reset({
				name: editingProduct.name,
				price: editingProduct.price,
				discount: editingProduct.discount,
				category: editingProduct.category || '', // Ensure category is never undefined
				description: editingProduct.description,
				stock: editingProduct.stock || 0,
			})
			setPreviewImage(editingProduct.image)
		} else {
			// When exiting edit mode or in add mode, reset to empty form
			reset({
				name: '',
				price: 0,
				discount: 0,
				category: '', // Ensure category is never undefined
				description: '',
				stock: 0,
			})
			setPreviewImage(undefined)
		}
	}, [editingProduct, reset])

	// Update useEffect to calculate statistics
	useEffect(() => {
		const uniqueCategories = new Set(products.map((p) => p.category))
		setStatistics({
			totalProducts: products.length,
			totalCategories: uniqueCategories.size,
			lowStockProducts: products.filter((p) => p.stock < 10).length,
			discountedProducts: products.filter((p) => p.discount > 0).length,
		})
	}, [products])

	// Add sorting function
	const sortProducts = (products: Product[]) => {
		return [...products].sort((a, b) => {
			return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
		})
	}

	// Add filter function
	const filterProducts = (products: Product[]) => {
		return products.filter(
			(product) =>
				(!filterCategory || product.category === filterCategory) &&
				(!searchQuery ||
					product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.description.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	}

	const onSubmit = async (data: ProductForm) => {
		console.log('Form submitted with data:', data)
		console.log('Category from form data:', data.category)
		console.log('Current editing product:', editingProduct)
		console.log('Current preview image:', previewImage)
		console.log('Selected file:', selectedFile)

		// Modified image validation - only require image for new products
		if (!editingProduct && !selectedFile && !previewImage) {
			console.log('Image validation failed:', {
				editingProduct: !!editingProduct,
				hasSelectedFile: !!selectedFile,
				hasPreview: !!previewImage,
			})
			setMessage('Please select a product image')
			return
		}

		setLoadingStates((prev) => ({ ...prev, submit: true }))
		const formData = new FormData()

		// Ensure all form data is properly formatted
		formData.append('name', data.name.trim())
		formData.append('price', data.price.toString())
		formData.append('discount', data.discount.toString())
		formData.append('category', data.category)
		formData.append('description', data.description.trim())
		formData.append('stock', Math.max(0, Math.floor(data.stock)).toString())

		// Only append image if we have a selected file
		if (selectedFile) {
			formData.append('image', selectedFile)
			console.log('Image file details:', {
				name: selectedFile.name,
				type: selectedFile.type,
				size: selectedFile.size,
				lastModified: selectedFile.lastModified,
			})
		} else if (editingProduct && previewImage === editingProduct.image) {
			// If we're editing and using the existing image, send a flag to the server
			formData.append('keepExistingImage', 'true')
		}

		try {
			let response

			// If editing, use PUT endpoint
			if (editingProduct) {
				console.log('Updating existing product...')
				response = await axios.put(
					`${config.API_URL}/api/products/admin/${editingProduct.id}`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						onUploadProgress: (progressEvent) => {
							const total = progressEvent.total || 0
							const percentCompleted = Math.round((progressEvent.loaded * 100) / total)
							console.log(`Upload progress: ${percentCompleted}%`)
						},
					}
				)
				console.log('Product update response:', response.data)
				setMessage(`Successfully updated "${editingProduct.name}"`)
			} else {
				// For new products, first test the upload
				if (selectedFile) {
					console.log('Testing upload for new product...')
					const testFormData = new FormData()
					const blob = new Blob([selectedFile], { type: selectedFile.type })
					testFormData.append('image', blob, selectedFile.name)

					const testUploadResponse = await axios.post(
						`${config.API_URL}/api/products/test-upload`,
						testFormData,
						{
							headers: {
								'Content-Type': 'multipart/form-data',
							},
						}
					)

					if (!testUploadResponse.data.success) {
						throw new Error(`Test upload failed: ${testUploadResponse.data.message}`)
					}
				}

				// If test succeeds or no file to test, proceed with product creation
				console.log('Creating new product...')
				response = await axios.post(`${config.API_URL}/api/products/admin`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					onUploadProgress: (progressEvent) => {
						const total = progressEvent.total || 0
						const percentCompleted = Math.round((progressEvent.loaded * 100) / total)
						console.log(`Upload progress: ${percentCompleted}%`)
					},
				})
				console.log('Product creation response:', response.data)
				setMessage(`Successfully added new product "${data.name}"`)
			}

			setShowSuccessSnackbar(true)
			setEditingProduct(null) // Clear editing state
			reset() // Reset form
			setPreviewImage(undefined) // Clear preview
			setSelectedFile(undefined) // Clear selected file
			await fetchProducts() // Refresh product list
		} catch (error) {
			console.error('Error sending product data:', error)
			if (axios.isAxiosError(error)) {
				if (error.response) {
					console.error('Server error response:', {
						status: error.response.status,
						data: error.response.data,
						headers: error.response.headers,
					})
					setMessage(
						`Error: ${
							error.response.data.message || error.response.statusText || 'Unknown server error'
						}`
					)
				} else if (error.request) {
					console.error('No response received. Request details:', error.request)
					setMessage('Error: Server did not respond. Check server status and network connection.')
				} else {
					console.error('Request setup error:', error.message)
					setMessage(`Error: ${error.message}`)
				}
			} else {
				console.error('Unknown error:', error)
				setMessage('Unknown error occurred while adding product')
			}
		} finally {
			setLoadingStates((prev) => ({ ...prev, submit: false }))
		}
	}

	const handleDelete = async (id: number) => {
		if (!window.confirm('Are you sure you want to delete this product?')) return

		setLoadingStates((prev) => ({ ...prev, delete: id }))
		try {
			await axios.delete(`${config.API_URL}/api/products/admin/${id}`)
			setMessage('Product deleted successfully!')
			await fetchProducts()
		} catch (error) {
			setMessage('Error deleting product')
			console.error(error)
		} finally {
			setLoadingStates((prev) => ({ ...prev, delete: null }))
		}
	}

	return (
		<Box
			sx={{
				p: 4,
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				backgroundColor: '#f5f5f5',
			}}
		>
			{/* Header Section with Statistics */}
			<Paper
				sx={{
					p: 2,
					mb: 2,
					borderRadius: 2,
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
					background: '#ffffff',
					border: '1px solid rgba(255, 77, 143, 0.1)',
				}}
			>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Box>
						<Typography
							variant='h5'
							sx={{
								fontWeight: 'bold',
								background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								display: 'inline-block',
								mb: 0.5,
							}}
						>
							Admin Dashboard
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							Manage your products and inventory
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Box sx={{ textAlign: 'center', px: 2 }}>
							<Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
								{statistics.totalProducts}
							</Typography>
							<Typography variant='caption' color='text.secondary'>
								Products
							</Typography>
						</Box>
						<Box sx={{ textAlign: 'center', px: 2 }}>
							<Typography variant='h6' sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
								{statistics.totalCategories}
							</Typography>
							<Typography variant='caption' color='text.secondary'>
								Categories
							</Typography>
						</Box>
						<Box sx={{ textAlign: 'center', px: 2 }}>
							<Typography variant='h6' sx={{ fontWeight: 'bold', color: 'error.main' }}>
								{statistics.lowStockProducts}
							</Typography>
							<Typography variant='caption' color='text.secondary'>
								Low Stock
							</Typography>
						</Box>
						<Box sx={{ textAlign: 'center', px: 2 }}>
							<Typography variant='h6' sx={{ fontWeight: 'bold', color: 'success.main' }}>
								{statistics.discountedProducts}
							</Typography>
							<Typography variant='caption' color='text.secondary'>
								On Discount
							</Typography>
						</Box>
					</Box>
				</Box>
			</Paper>

			{/* Success Snackbar */}
			<Snackbar
				open={showSuccessSnackbar}
				autoHideDuration={3000}
				onClose={() => setShowSuccessSnackbar(false)}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Alert severity='success' variant='filled'>
					{editingProduct
						? `Successfully updated "${editingProduct.name}"`
						: 'Successfully added new product'}
				</Alert>
			</Snackbar>

			{message && (
				<Box
					sx={{
						mb: 3,
						p: 2,
						borderRadius: 2,
						backgroundColor: message.includes('Error')
							? 'rgba(211, 47, 47, 0.08)'
							: 'rgba(76, 175, 80, 0.08)',
						color: message.includes('Error') ? 'error.main' : 'success.main',
						border: `1px solid ${
							message.includes('Error') ? 'rgba(211, 47, 47, 0.2)' : 'rgba(76, 175, 80, 0.2)'
						}`,
					}}
				>
					<Typography>{message}</Typography>
				</Box>
			)}

			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					gap: 3,
					flex: 1,
					overflow: 'hidden',
				}}
			>
				{/* Product List - Left Side */}
				<Paper
					sx={{
						p: 3,
						borderRadius: 2,
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
						flex: { xs: '1 1 100%', md: '0 0 40%' },
						display: 'flex',
						flexDirection: 'column',
						overflow: 'hidden',
						border: '1px solid rgba(255, 77, 143, 0.1)',
						background: '#ffffff',
					}}
				>
					{/* Search and Filter Controls */}
					<Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
						<TextField
							size='small'
							placeholder='Search products...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<SearchIcon />
									</InputAdornment>
								),
							}}
							sx={{ flex: 1 }}
						/>
						<Tooltip title='Sort products'>
							<IconButton
								size='small'
								onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
							>
								<SortIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title='Filter by category'>
							<IconButton size='small' onClick={() => setFilterCategory('')}>
								<FilterIcon />
							</IconButton>
						</Tooltip>
					</Box>

					{/* Active Filters */}
					{(filterCategory || searchQuery) && (
						<Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
							{filterCategory && (
								<Chip
									label={`Category: ${filterCategory}`}
									onDelete={() => setFilterCategory('')}
									size='small'
								/>
							)}
							{searchQuery && (
								<Chip
									label={`Search: ${searchQuery}`}
									onDelete={() => setSearchQuery('')}
									size='small'
								/>
							)}
						</Box>
					)}

					<Box sx={{ overflow: 'auto', flex: 1 }}>
						{loadingStates.products ? (
							// Loading skeletons
							[...Array(3)].map((_, i) => (
								<Box key={i} sx={{ mb: 2 }}>
									<Skeleton variant='rectangular' height={100} sx={{ borderRadius: 2 }} />
								</Box>
							))
						) : filterProducts(sortProducts(products)).length === 0 ? (
							<Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
								No products found
							</Typography>
						) : (
							filterProducts(sortProducts(products)).map((product) => (
								<Fade in key={product.id}>
									<Box
										sx={{
											mb: 2,
											p: 2,
											borderRadius: 2,
											border: '1px solid',
											borderColor: 'divider',
											transition: 'all 0.3s ease',
											'&:hover': {
												transform: 'translateY(-2px)',
												boxShadow: 2,
											},
										}}
									>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
											<Box
												sx={{
													width: 80,
													height: 80,
													borderRadius: 3,
													overflow: 'hidden',
													boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
													border: '1px solid rgba(255, 77, 143, 0.15)',
													position: 'relative',
													transition: 'all 0.3s ease',
													'&:hover': {
														transform: 'scale(1.05)',
														boxShadow: '0 6px 12px rgba(255, 77, 143, 0.2)',
													},
													'&::before': {
														content: '""',
														position: 'absolute',
														top: 0,
														left: 0,
														width: '100%',
														height: '100%',
														background:
															'linear-gradient(135deg, rgba(255,77,143,0.1) 0%, rgba(156,39,176,0.1) 100%)',
														opacity: 0,
														transition: 'opacity 0.3s ease',
														zIndex: 1,
														pointerEvents: 'none',
													},
													'&:hover::before': {
														opacity: 0.5,
													},
												}}
											>
												<img
													src={product.image}
													alt={product.name}
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover',
														transition: 'transform 0.5s ease',
													}}
													onMouseOver={(e) => {
														e.currentTarget.style.transform = 'scale(1.1)'
													}}
													onMouseOut={(e) => {
														e.currentTarget.style.transform = 'scale(1)'
													}}
												/>
											</Box>
											<Box sx={{ flex: 1 }}>
												<Typography
													variant='h6'
													sx={{
														fontWeight: 600,
														mb: 0.5,
														color: 'text.primary',
													}}
												>
													{product.name}
												</Typography>
												<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
													<Typography
														variant='body2'
														sx={{
															color: 'primary.main',
															bgcolor: 'rgba(255, 77, 143, 0.08)',
															px: 1,
															py: 0.5,
															borderRadius: 1,
															display: 'inline-flex',
															alignItems: 'center',
														}}
													>
														{product.category}
													</Typography>
													<Typography
														variant='body2'
														sx={{
															fontWeight: 'bold',
															color: product.discount > 0 ? 'success.main' : 'text.primary',
														}}
													>
														₹{product.price.toFixed(2)}
														{product.discount > 0 && (
															<Typography
																component='span'
																variant='caption'
																sx={{
																	ml: 1,
																	color: 'success.main',
																}}
															>
																(-{product.discount}%)
															</Typography>
														)}
													</Typography>
													<Typography
														variant='body2'
														sx={{
															color: product.stock > 0 ? 'success.main' : 'error.main',
															bgcolor:
																product.stock > 0
																	? 'rgba(76, 175, 80, 0.08)'
																	: 'rgba(211, 47, 47, 0.08)',
															px: 1,
															py: 0.5,
															borderRadius: 1,
															display: 'inline-flex',
															alignItems: 'center',
														}}
													>
														{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
													</Typography>
												</Box>
												<Typography
													variant='body2'
													color='text.secondary'
													sx={{
														display: '-webkit-box',
														WebkitLineClamp: 2,
														WebkitBoxOrient: 'vertical',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														maxWidth: '100%',
													}}
												>
													{product.description}
												</Typography>
											</Box>
											<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
												<Tooltip title='Edit product'>
													<Button
														size='small'
														onClick={() => setEditingProduct(product)}
														startIcon={<EditIcon />}
														sx={{ mr: 1 }}
													>
														Edit
													</Button>
												</Tooltip>
												<Tooltip title='Delete product'>
													<Button
														size='small'
														color='error'
														onClick={() => handleDelete(product.id)}
														startIcon={
															loadingStates.delete === product.id ? (
																<CircularProgress size={20} />
															) : (
																<DeleteIcon />
															)
														}
														disabled={loadingStates.delete === product.id}
													>
														Delete
													</Button>
												</Tooltip>
											</Box>
										</Box>
									</Box>
								</Fade>
							))
						)}
					</Box>
				</Paper>

				{/* Add/Edit Form - Right Side */}
				<Paper
					sx={{
						p: 3,
						borderRadius: 2,
						boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
						border: '1px solid rgba(255, 77, 143, 0.1)',
						flex: { xs: '1 1 100%', md: '0 0 60%' },
						display: 'flex',
						flexDirection: 'column',
						overflow: 'auto',
						maxHeight: 'calc(100vh - 200px)',
						background: '#ffffff',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							mb: 2,
							pb: 2,
							borderBottom: '1px solid rgba(255, 77, 143, 0.2)',
						}}
					>
						{editingProduct ? (
							<EditIcon sx={{ mr: 1, color: 'primary.main' }} />
						) : (
							<AddIcon sx={{ mr: 1, color: 'primary.main' }} />
						)}
						<Typography
							variant='h5'
							sx={{
								fontWeight: 'bold',
								color: editingProduct ? 'primary.main' : 'text.primary',
							}}
						>
							{editingProduct ? `Editing: ${editingProduct.name}` : 'Add New Product'}
						</Typography>
					</Box>

					<form
						onSubmit={handleSubmit(onSubmit)}
						key={editingProduct ? `edit-${editingProduct.id}` : 'add-new'}
						style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
					>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<TextField label='Product Name' {...register('name')} required size='small' />

							<Box sx={{ display: 'flex', gap: 2 }}>
								<TextField
									label='Price'
									type='number'
									size='small'
									inputProps={{ min: 0, step: 0.01 }}
									{...register('price', { valueAsNumber: true, min: 0 })}
									required
									error={!!errors.price}
									helperText={errors.price?.message}
									sx={{ flex: 1 }}
								/>

								<TextField
									label='Discount (%)'
									type='number'
									size='small'
									inputProps={{ min: 0, max: 100 }}
									{...register('discount', {
										valueAsNumber: true,
										min: 0,
										max: 100,
									})}
									error={!!errors.discount}
									helperText={errors.discount?.message}
									sx={{ flex: 1 }}
								/>
							</Box>

							<Box sx={{ display: 'flex', gap: 2 }}>
								<FormControl sx={{ flex: 1 }} size='small'>
									<InputLabel>Category</InputLabel>
									<Controller
										name='category'
										control={control}
										defaultValue=''
										rules={{ required: 'Category is required' }}
										render={({ field }) => (
											<Select {...field} label='Category' error={!!errors.category}>
												{AVAILABLE_CATEGORIES.map((category) => (
													<MenuItem key={category} value={category}>
														{category}
													</MenuItem>
												))}
											</Select>
										)}
									/>
									{errors.category && (
										<FormHelperText error>{errors.category.message}</FormHelperText>
									)}
								</FormControl>

								<TextField
									label='Stock Quantity'
									type='number'
									size='small'
									{...register('stock', {
										valueAsNumber: true,
										min: 0,
										required: true,
									})}
									required
									error={!!errors.stock}
									helperText={errors.stock?.message}
									InputProps={{
										inputProps: { min: 0 },
									}}
									sx={{ flex: 1 }}
								/>
							</Box>
						</Box>

						<TextField
							label='Description'
							multiline
							rows={2}
							size='small'
							{...register('description')}
							required
						/>

						<Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
							<Box sx={{ flex: 1 }}>
								<input
									type='file'
									accept='image/*'
									id='product-image-upload'
									style={{ display: 'none' }}
									onChange={(e) => {
										const file = e.target.files?.[0]
										console.log('File input change:', {
											hasFile: !!file,
											fileName: file?.name,
											fileType: file?.type,
											fileSize: file?.size,
										})

										if (file) {
											const imageUrl = URL.createObjectURL(file)
											console.log('Created preview URL:', imageUrl)
											setPreviewImage(imageUrl)
											setSelectedFile(file)
										} else if (editingProduct) {
											console.log('Reverting to editing product image:', editingProduct.image)
											setPreviewImage(editingProduct.image)
											setSelectedFile(undefined)
										} else {
											console.log('Clearing preview image')
											setPreviewImage(undefined)
											setSelectedFile(undefined)
										}
									}}
								/>
								<label htmlFor='product-image-upload'>
									<Button
										variant='outlined'
										component='span'
										size='small'
										sx={{
											borderRadius: 2,
											px: 2,
											py: 1,
											borderColor: !editingProduct && !previewImage ? 'error.main' : 'primary.main',
											color: !editingProduct && !previewImage ? 'error.main' : 'primary.main',
											background:
												'linear-gradient(to right, rgba(255, 77, 143, 0.05), rgba(156, 39, 176, 0.05))',
											'&:hover': {
												borderColor: 'primary.dark',
												background:
													'linear-gradient(to right, rgba(255, 77, 143, 0.1), rgba(156, 39, 176, 0.1))',
												boxShadow: '0 4px 8px rgba(255, 77, 143, 0.15)',
											},
										}}
									>
										<CloudUploadIcon sx={{ mr: 1 }} />
										{previewImage ? 'Change Image' : 'Upload Product Image'}
										{!editingProduct && !previewImage && ' *'}
									</Button>
								</label>
							</Box>

							{previewImage && (
								<Box
									sx={{
										position: 'relative',
										display: 'inline-block',
										borderRadius: '8px',
										padding: '4px',
										background:
											'linear-gradient(to bottom right, rgba(255, 77, 143, 0.05), rgba(156, 39, 176, 0.05))',
										border: '1px solid rgba(255, 77, 143, 0.15)',
										boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
									}}
								>
									<img
										src={previewImage}
										alt='Preview'
										style={{
											width: 100,
											height: 100,
											borderRadius: '6px',
											objectFit: 'cover',
											display: 'block',
										}}
									/>
								</Box>
							)}
						</Box>

						<Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
							<Button
								type='submit'
								variant='contained'
								color='primary'
								size='small'
								startIcon={
									loadingStates.submit ? (
										<CircularProgress size={20} />
									) : editingProduct ? (
										<SaveIcon />
									) : (
										<AddIcon />
									)
								}
								sx={{
									borderRadius: 2,
									px: 3,
									py: 1,
									boxShadow: '0 4px 8px rgba(255, 77, 143, 0.2)',
									'&:hover': {
										boxShadow: '0 6px 12px rgba(255, 77, 143, 0.3)',
									},
								}}
								disabled={loadingStates.submit}
							>
								{loadingStates.submit
									? 'Saving...'
									: editingProduct
									? 'Update Product'
									: 'Add Product'}
							</Button>

							{editingProduct && (
								<Button
									variant='outlined'
									color='secondary'
									size='small'
									onClick={() => {
										setEditingProduct(null)
									}}
									sx={{
										borderRadius: 2,
										px: 3,
										py: 1,
									}}
									disabled={loadingStates.submit}
								>
									Cancel Edit
								</Button>
							)}
						</Box>
					</form>
				</Paper>
			</Box>
		</Box>
	)
}

export default AdminDashboard
