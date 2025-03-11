const path = require('path')
const fs = require('fs')
const ProductModel = require('../models/productModel')
const NodeCache = require('node-cache')
const { NotFoundError } = require('../utils/errors')

// Initialize cache with 5 minute TTL
const cache = new NodeCache({ stdTTL: 300 })

// Helper function to delete image file
const deleteImageFile = (imagePath) => {
	if (!imagePath) return

	// Don't delete default images
	if (imagePath.includes('saree')) return

	const fullPath = path.join(__dirname, '../../client/public', imagePath)
	fs.unlink(fullPath, (err) => {
		if (err) console.error('Error deleting image file:', err)
	})
}

// Get all products with filtering, pagination, and caching
async function getAllProducts(req, res, next) {
	try {
		const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query
		const cacheKey = `products_${category || ''}_${minPrice || ''}_${
			maxPrice || ''
		}_${page}_${limit}`

		// Check cache first
		const cachedData = cache.get(cacheKey)
		if (cachedData) {
			// Set pagination headers
			res.set({
				'X-Total-Count': cachedData.pagination.total,
				'X-Total-Pages': cachedData.pagination.totalPages,
				'X-Current-Page': cachedData.pagination.page,
			})
			return res.json(cachedData)
		}

		const result = await ProductModel.getAllProducts({
			category,
			minPrice,
			maxPrice,
			page,
			limit,
		})

		// Set pagination headers
		res.set({
			'X-Total-Count': result.pagination.total,
			'X-Total-Pages': result.pagination.totalPages,
			'X-Current-Page': result.pagination.page,
		})

		// Cache the result
		cache.set(cacheKey, result)

		res.json(result)
	} catch (error) {
		next(error)
	}
}

// Get a single product by ID
async function getProductById(req, res, next) {
	try {
		const { id } = req.params
		const cacheKey = `product_${id}`

		// Check cache first
		const cachedProduct = cache.get(cacheKey)
		if (cachedProduct) {
			return res.json(cachedProduct)
		}

		const product = await ProductModel.getProductById(id)

		if (!product) {
			throw new NotFoundError(`Product with ID ${id} not found`)
		}

		// Cache the result
		cache.set(cacheKey, product)

		res.json(product)
	} catch (error) {
		next(error)
	}
}

// Create a new product
async function createProduct(req, res, next) {
	try {
		const { name, price, discount, category, description, stock } = req.body
		const image = `/images/${req.file.filename}`

		const product = await ProductModel.createProduct({
			name,
			price,
			discount,
			category,
			image,
			description,
			stock,
		})

		// Invalidate products cache
		cache.del(/^products_/)

		res.status(201).json({
			message: 'Product created successfully',
			product,
		})
	} catch (error) {
		// Delete uploaded image if there was an error
		if (req.file) {
			deleteImageFile(`/images/${req.file.filename}`)
		}
		next(error)
	}
}

// Update an existing product
async function updateProduct(req, res, next) {
	try {
		const { id } = req.params
		const { name, price, discount, category, description, stock } = req.body

		// Check if product exists
		const existingProduct = await ProductModel.getProductById(id)

		if (!existingProduct) {
			throw new NotFoundError(`Product with ID ${id} not found`)
		}

		// Handle image update
		let image = existingProduct.image
		if (req.file) {
			// Delete old image if it exists and is not a default image
			deleteImageFile(existingProduct.image)
			image = `/images/${req.file.filename}`
		}

		const updatedProduct = await ProductModel.updateProduct(id, {
			name,
			price,
			discount,
			category,
			image,
			description,
			stock,
		})

		// Invalidate caches
		cache.del(`product_${id}`)
		cache.del(/^products_/)

		res.json({
			message: 'Product updated successfully',
			product: updatedProduct,
		})
	} catch (error) {
		// Delete uploaded image if there was an error
		if (req.file) {
			deleteImageFile(`/images/${req.file.filename}`)
		}
		next(error)
	}
}

// Delete a product
async function deleteProduct(req, res, next) {
	try {
		const { id } = req.params

		// Get product to get the image path
		const product = await ProductModel.getProductById(id)

		if (!product) {
			throw new NotFoundError(`Product with ID ${id} not found`)
		}

		// Delete the product
		await ProductModel.deleteProduct(id)

		// Delete the image file
		deleteImageFile(product.image)

		// Invalidate caches
		cache.del(`product_${id}`)
		cache.del(/^products_/)

		res.json({ message: 'Product deleted successfully' })
	} catch (error) {
		next(error)
	}
}

// Handle checkout process
async function processCheckout(req, res, next) {
	try {
		const { cart, shippingInfo, paymentInfo } = req.body

		if (!cart || !Array.isArray(cart) || cart.length === 0) {
			return res.status(400).json({ error: 'Invalid cart data' })
		}

		// Validate shipping info
		if (!shippingInfo || !shippingInfo.firstName || !shippingInfo.email || !shippingInfo.address) {
			return res.status(400).json({ error: 'Shipping information is incomplete' })
		}

		// Validate payment info (in a real app, you'd use a payment processor)
		if (!paymentInfo || !paymentInfo.cardNumber || !paymentInfo.expDate || !paymentInfo.cvv) {
			return res.status(400).json({ error: 'Payment information is incomplete' })
		}

		// Generate a mock order ID
		const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

		// Calculate total
		let total = 0
		for (const item of cart) {
			const product = await ProductModel.getProductById(item.id)
			if (product) {
				const discountedPrice = product.price * (1 - product.discount / 100)
				total += discountedPrice * item.quantity
			}
		}

		// In a real application, you would:
		// 1. Validate stock availability
		// 2. Process payment
		// 3. Create order in database
		// 4. Update stock levels
		// 5. Send confirmation email

		// Log the order for debugging
		console.log('Order processed:', {
			orderId,
			total: parseFloat(total.toFixed(2)),
			items: cart.length,
			shippingInfo: {
				...shippingInfo,
				// Don't log full address for privacy
				address: `${shippingInfo.address.substring(0, 5)}...`,
			},
			// Don't log sensitive payment info
			paymentMethod: 'Credit Card',
			currency: '₹',
		})

		res.json({
			message: 'Order placed successfully!',
			orderId,
			total: parseFloat(total.toFixed(2)),
			items: cart.length,
			date: new Date().toISOString(),
			currency: '₹',
		})
	} catch (error) {
		console.error('Checkout error:', error)
		next(error)
	}
}

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	processCheckout,
}
