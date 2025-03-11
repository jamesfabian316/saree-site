import React, { useState, useEffect } from 'react'
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
} from '@mui/material'
import {
	CloudUpload as CloudUploadIcon,
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Save as SaveIcon,
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
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [products, setProducts] = useState<Product[]>([])
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const fetchProducts = async () => {
		setIsLoading(true)
		try {
			const response = await axios.get(`${config.API_URL}/api/products`)
			console.log('Products fetched:', response.data) // Debug log
			console.log('First product category:', response.data.products[0]?.category)
			setProducts(response.data.products)
		} catch (error) {
			console.error('Error fetching products:', error)
			setMessage('Error loading products')
		} finally {
			setIsLoading(false)
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

	const onSubmit = async (data: ProductForm) => {
		console.log('Form submitted with data:', data)
		console.log('Category from form data:', data.category)
		console.log('Current editing product:', editingProduct)
		console.log('Current preview image:', previewImage)

		// Ensure category is never undefined
		if (!data.category) {
			setMessage('Please select a category')
			return
		}

		setIsSubmitting(true)
		const formData = new FormData()

		// Ensure all form data is properly formatted
		formData.append('name', data.name.trim())
		formData.append('price', data.price.toString())
		formData.append('discount', data.discount.toString())
		formData.append('category', data.category)
		formData.append('description', data.description.trim())
		formData.append('stock', Math.max(0, Math.floor(data.stock)).toString())

		// Only append image if a new one is selected
		if (data.image?.[0]) {
			formData.append('image', data.image[0])
		} else if (editingProduct && previewImage === editingProduct.image) {
			// If we're editing and using the existing image, send a flag to the server
			formData.append('keepExistingImage', 'true')
		}

		try {
			if (editingProduct) {
				console.log('Updating product:', editingProduct.id, formData)

				// Log the actual data being sent
				console.log('FormData contents:')
				for (const pair of formData.entries()) {
					console.log(pair[0] + ': ' + pair[1])
				}

				const response = await axios.put(
					`${config.API_URL}/api/products/admin/${editingProduct.id}`,
					formData,
					{
						headers: { 'Content-Type': 'multipart/form-data' },
					}
				)
				console.log('Update response:', response.data)
				setMessage('Product updated successfully!')
				setEditingProduct(null)
			} else {
				await axios.post(`${config.API_URL}/api/products/admin`, formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				})
				setMessage('Product added successfully!')
			}
			reset({
				name: '',
				price: 0,
				discount: 0,
				category: '', // Ensure category is never undefined
				description: '',
				stock: 0,
			})
			setPreviewImage(undefined)
			await fetchProducts()
		} catch (error) {
			console.error('Error in form submission:', error)
			if (axios.isAxiosError(error) && error.response) {
				console.error('Server response:', error.response.data)
				setMessage(`Error: ${error.response.data.message || 'Unknown server error'}`)
			} else {
				setMessage(editingProduct ? 'Error updating product' : 'Error adding product')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (id: number) => {
		if (!window.confirm('Are you sure you want to delete this product?')) return

		try {
			await axios.delete(`${config.API_URL}/api/products/admin/${id}`)
			setMessage('Product deleted successfully!')
			await fetchProducts()
		} catch (error) {
			setMessage('Error deleting product')
			console.error(error)
		}
	}

	return (
		<Box sx={{ p: 4, maxHeight: '100vh', overflow: 'hidden' }}>
			<Typography
				variant='h4'
				gutterBottom
				sx={{
					fontWeight: 'bold',
					mb: 4,
					pb: 2,
					borderBottom: '1px solid rgba(255, 77, 143, 0.2)',
					background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundClip: 'text',
					display: 'inline-block',
				}}
			>
				Admin Dashboard
			</Typography>

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
					}}
				>
					<Typography>{message}</Typography>
				</Box>
			)}

			<Box
				sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, height: '100%' }}
			>
				{/* Product List - Left Side */}
				<Paper
					sx={{
						p: 3,
						borderRadius: 2,
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
						flex: { xs: '1 1 100%', md: '1 1 50%' },
						maxHeight: '80vh',
						overflow: 'auto',
					}}
				>
					<Typography
						variant='h5'
						gutterBottom
						sx={{
							fontWeight: 'bold',
							mb: 3,
							pb: 2,
							borderBottom: '1px solid rgba(255, 77, 143, 0.2)',
							background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							display: 'inline-block',
						}}
					>
						Product List
					</Typography>

					{isLoading ? (
						<Typography>Loading products...</Typography>
					) : products.length === 0 ? (
						<Typography>No products found</Typography>
					) : (
						products.map((product) => (
							<Box
								key={product.id}
								sx={{
									mb: 3,
									p: 3,
									border: '1px solid rgba(255, 77, 143, 0.2)',
									borderRadius: 2,
									boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
									transition: 'all 0.3s ease',
									'&:hover': {
										boxShadow: '0 4px 12px rgba(255, 77, 143, 0.15)',
										borderColor: 'rgba(255, 77, 143, 0.4)',
										transform: 'translateY(-2px)',
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
									<Box>
										<Button
											size='small'
											onClick={() => {
												console.log('Edit button clicked for product:', product)
												console.log('Product category:', product.category)
												console.log('Available categories:', AVAILABLE_CATEGORIES)
												setEditingProduct(product)
											}}
											sx={{
												mr: 1,
												borderRadius: 4,
												px: 2,
												color: 'primary.main',
												borderColor: 'primary.main',
												'&:hover': {
													backgroundColor: 'rgba(255, 77, 143, 0.08)',
												},
											}}
											variant='outlined'
											startIcon={<EditIcon fontSize='small' />}
										>
											Edit
										</Button>
										<Button
											size='small'
											color='error'
											onClick={() => handleDelete(product.id)}
											sx={{
												borderRadius: 4,
												px: 2,
												'&:hover': {
													backgroundColor: 'rgba(211, 47, 47, 0.08)',
												},
											}}
											variant='outlined'
											startIcon={<DeleteIcon fontSize='small' />}
										>
											Delete
										</Button>
									</Box>
								</Box>
							</Box>
						))
					)}
				</Paper>

				{/* Add/Edit Form - Right Side */}
				<Paper
					sx={{
						p: 3,
						borderRadius: 2,
						boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
						border: '1px solid rgba(255, 77, 143, 0.1)',
						flex: { xs: '1 1 100%', md: '1 1 50%' },
						maxHeight: '80vh',
						overflow: 'auto',
					}}
				>
					<Typography
						variant='h5'
						gutterBottom
						sx={{
							mb: 3,
							color: editingProduct ? 'primary.main' : 'text.primary',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						{editingProduct ? (
							<>
								<EditIcon sx={{ mr: 1 }} />
								Editing: {editingProduct.name}
							</>
						) : (
							'Add New Product'
						)}
					</Typography>

					<form
						onSubmit={handleSubmit(onSubmit)}
						key={editingProduct ? `edit-${editingProduct.id}` : 'add-new'}
					>
						<TextField
							fullWidth
							label='Product Name'
							{...register('name')}
							required
							sx={{ mb: 2 }}
						/>

						<TextField
							fullWidth
							label='Price'
							type='number'
							inputProps={{ min: 0, step: 0.01 }}
							{...register('price', { valueAsNumber: true, min: 0 })}
							required
							sx={{ mb: 2 }}
							error={!!errors.price}
							helperText={errors.price?.message}
						/>

						<TextField
							fullWidth
							label='Discount (%)'
							type='number'
							inputProps={{ min: 0, max: 100 }}
							{...register('discount', {
								valueAsNumber: true,
								min: 0,
								max: 100,
							})}
							sx={{ mb: 2 }}
							error={!!errors.discount}
							helperText={errors.discount?.message}
						/>

						<TextField
							fullWidth
							label='Stock Quantity'
							type='number'
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
							sx={{ mb: 2 }}
						/>

						<FormControl fullWidth sx={{ mb: 2 }}>
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
							{errors.category && <FormHelperText error>{errors.category.message}</FormHelperText>}
						</FormControl>

						<TextField
							fullWidth
							label='Description'
							multiline
							rows={4}
							{...register('description')}
							required
							sx={{ mb: 2 }}
						/>

						<Box sx={{ mb: 3, mt: 1 }}>
							<input
								type='file'
								accept='image/*'
								id='product-image-upload'
								style={{ display: 'none' }}
								{...register('image')}
								onChange={(e) => {
									const file = e.target.files?.[0]
									if (file) {
										// If a new file is selected, create an object URL
										setPreviewImage(URL.createObjectURL(file))
									} else if (editingProduct) {
										// If the file input is cleared during editing, revert to the product image
										setPreviewImage(editingProduct.image)
									} else {
										// If the file input is cleared during add mode, clear the preview
										setPreviewImage(undefined)
									}
								}}
							/>
							<label htmlFor='product-image-upload'>
								<Button
									variant='outlined'
									component='span'
									sx={{
										borderRadius: 2,
										px: 3,
										py: 1.5,
										borderColor: 'primary.main',
										color: 'primary.main',
										background:
											'linear-gradient(to right, rgba(255, 77, 143, 0.05), rgba(156, 39, 176, 0.05))',
										'&:hover': {
											borderColor: 'primary.dark',
											background:
												'linear-gradient(to right, rgba(255, 77, 143, 0.1), rgba(156, 39, 176, 0.1))',
											boxShadow: '0 4px 8px rgba(255, 77, 143, 0.15)',
										},
										transition: 'all 0.3s ease',
									}}
								>
									<CloudUploadIcon sx={{ mr: 1 }} />
									{previewImage ? 'Change Image' : 'Upload Product Image'}
								</Button>
							</label>
							{previewImage ? (
								<Box
									sx={{
										mt: 3,
										mb: 2,
										position: 'relative',
										display: 'inline-block',
										borderRadius: '12px',
										padding: '8px',
										background:
											'linear-gradient(to bottom right, rgba(255, 77, 143, 0.05), rgba(156, 39, 176, 0.05))',
										border: '1px solid rgba(255, 77, 143, 0.15)',
										boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
										transition: 'all 0.3s ease',
										'&:hover': {
											boxShadow: '0 8px 24px rgba(255, 77, 143, 0.15)',
											transform: 'translateY(-3px)',
										},
									}}
								>
									<Box
										sx={{
											position: 'relative',
											borderRadius: '8px',
											overflow: 'hidden',
											width: 'fit-content',
											'&::before': {
												content: '""',
												position: 'absolute',
												top: 0,
												left: 0,
												width: '100%',
												height: '100%',
												background:
													'linear-gradient(135deg, rgba(255,77,143,0.05) 0%, rgba(156,39,176,0.05) 100%)',
												zIndex: 1,
												opacity: 0,
												transition: 'opacity 0.3s ease',
												pointerEvents: 'none',
											},
											'&:hover::before': {
												opacity: 1,
											},
										}}
									>
										<img
											src={previewImage}
											alt='Preview'
											style={{
												maxWidth: 220,
												maxHeight: 220,
												borderRadius: '8px',
												display: 'block',
												transition: 'transform 0.5s ease',
											}}
											onMouseOver={(e) => {
												e.currentTarget.style.transform = 'scale(1.03)'
											}}
											onMouseOut={(e) => {
												e.currentTarget.style.transform = 'scale(1)'
											}}
										/>
									</Box>
									<Typography
										variant='caption'
										sx={{
											display: 'block',
											mt: 1.5,
											textAlign: 'center',
											color: 'primary.main',
											fontWeight: 500,
										}}
									>
										Image Preview
									</Typography>
								</Box>
							) : (
								<Box
									sx={{
										mt: 2,
										p: 3,
										borderRadius: '8px',
										border: '1px dashed rgba(255, 77, 143, 0.3)',
										backgroundColor: 'rgba(255, 77, 143, 0.03)',
										textAlign: 'center',
									}}
								>
									<Typography variant='caption' sx={{ color: 'text.secondary', display: 'block' }}>
										No image selected. Please upload a product image.
									</Typography>
								</Box>
							)}
						</Box>

						<Box sx={{ display: 'flex', gap: 2 }}>
							<Button
								type='submit'
								variant='contained'
								color='primary'
								startIcon={isSubmitting ? null : editingProduct ? <SaveIcon /> : <AddIcon />}
								sx={{
									borderRadius: 2,
									px: 3,
									py: 1.2,
									boxShadow: '0 4px 8px rgba(255, 77, 143, 0.2)',
									'&:hover': {
										boxShadow: '0 6px 12px rgba(255, 77, 143, 0.3)',
									},
								}}
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Submitting...' : editingProduct ? 'Update Product' : 'Add Product'}
							</Button>

							{editingProduct && (
								<Button
									variant='outlined'
									color='secondary'
									onClick={() => {
										setEditingProduct(null)
									}}
									sx={{
										borderRadius: 2,
										px: 3,
										py: 1.2,
									}}
									disabled={isSubmitting}
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
