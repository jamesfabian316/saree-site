const db = require('../utils/db')
const { ValidationError } = require('../utils/errors')
const { body, validationResult } = require('express-validator')
require('dotenv').config()

/**
 * Create indexes for the products table
 */
async function createIndexes() {
	await db.run('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)')
	await db.run('CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)')
}

/**
 * Get all products with optional filtering and pagination
 * @param {Object} options - Query options
 * @param {string} options.category - Filter by category
 * @param {number} options.minPrice - Filter by minimum price
 * @param {number} options.maxPrice - Filter by maximum price
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @returns {Promise<{products: Array, pagination: Object}>} - Products and pagination info
 */
async function getAllProducts({ category, minPrice, maxPrice, page = 1, limit = 10 }) {
	const offset = (page - 1) * limit

	let query = 'SELECT * FROM products'
	let countQuery = 'SELECT COUNT(*) as total FROM products'
	let params = []
	let whereClause = ''

	if (category || minPrice || maxPrice) {
		whereClause = ' WHERE '
		const conditions = []

		if (category) {
			conditions.push('category = ?')
			params.push(category)
		}

		if (minPrice) {
			conditions.push('price >= ?')
			params.push(minPrice)
		}

		if (maxPrice) {
			conditions.push('price <= ?')
			params.push(maxPrice)
		}

		whereClause += conditions.join(' AND ')
	}

	query += whereClause + ' ORDER BY id DESC LIMIT ? OFFSET ?'
	countQuery += whereClause

	const countParams = [...params]
	params.push(limit, offset)

	const total = await db.get(countQuery, countParams)
	const products = await db.all(query, params)

	return {
		products,
		pagination: {
			total: total.total,
			page: parseInt(page),
			limit: parseInt(limit),
			totalPages: Math.ceil(total.total / limit),
		},
	}
}

/**
 * Get a product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object>} - Product object
 */
async function getProductById(id) {
	return db.get('SELECT * FROM products WHERE id = ?', [id])
}

/**
 * Create a new product
 * @param {Object} product - Product data
 * @returns {Promise<Object>} - Created product
 */
async function createProduct(product) {
	validateProduct(product)

	const { name, price, discount, category, image, description, stock } = product

	const result = await db.run(
		'INSERT INTO products (name, price, discount, category, image, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[name, price, discount, category, image, description, stock]
	)

	return {
		id: result.lastID,
		...product,
	}
}

/**
 * Update a product
 * @param {number} id - Product ID
 * @param {Object} product - Updated product data
 * @returns {Promise<Object>} - Updated product
 */
async function updateProduct(id, product) {
	try {
		validateProduct(product)

		const { name, price, discount, category, image, description, stock } = product

		// Ensure numeric values are properly converted
		const numericPrice = parseFloat(price)
		const numericDiscount = parseFloat(discount)
		const numericStock = parseInt(stock)

		console.log('Updating product in database:', {
			id,
			name,
			price: numericPrice,
			discount: numericDiscount,
			category,
			image,
			description,
			stock: numericStock,
		})

		const result = await db.run(
			'UPDATE products SET name = ?, price = ?, discount = ?, category = ?, image = ?, description = ?, stock = ? WHERE id = ?',
			[name, numericPrice, numericDiscount, category, image, description, numericStock, id]
		)

		console.log('Database update result:', result)

		// Verify the update was successful
		if (result.changes === 0) {
			console.warn(`No rows were updated for product ID ${id}. The product might not exist.`)
		}

		return {
			id,
			name,
			price: numericPrice,
			discount: numericDiscount,
			category,
			image,
			description,
			stock: numericStock,
		}
	} catch (error) {
		console.error('Error in updateProduct:', error.message)
		console.error('Error stack:', error.stack)
		throw error
	}
}

/**
 * Delete a product
 * @param {number} id - Product ID
 * @returns {Promise<boolean>} - Success status
 */
async function deleteProduct(id) {
	const result = await db.run('DELETE FROM products WHERE id = ?', [id])
	return result.changes > 0
}

/**
 * Validate product data
 * @param {Object} product - Product data to validate
 * @throws {ValidationError} - If validation fails
 */
function validateProduct(product) {
	console.log('Validating product data:', product)

	const { name, price, discount, category, description, stock } = product

	if (
		!name ||
		price === undefined ||
		discount === undefined ||
		!category ||
		!description ||
		stock === undefined
	) {
		const missingFields = []
		if (!name) missingFields.push('name')
		if (price === undefined) missingFields.push('price')
		if (discount === undefined) missingFields.push('discount')
		if (!category) missingFields.push('category')
		if (!description) missingFields.push('description')
		if (stock === undefined) missingFields.push('stock')

		throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`)
	}

	const numericPrice = parseFloat(price)
	if (isNaN(numericPrice) || numericPrice <= 0) {
		throw new ValidationError(`Price must be a positive number, got: ${price} (${typeof price})`)
	}

	const numericDiscount = parseFloat(discount)
	if (isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
		throw new ValidationError(
			`Discount must be a number between 0 and 100, got: ${discount} (${typeof discount})`
		)
	}

	const numericStock = parseInt(stock)
	if (isNaN(numericStock) || numericStock < 0) {
		throw new ValidationError(
			`Stock must be a non-negative integer, got: ${stock} (${typeof stock})`
		)
	}
}

// Validation rules for products
const productValidationRules = [
	body('name').notEmpty().withMessage('Name is required'),
	body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
	body('discount').isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
	body('category').notEmpty().withMessage('Category is required'),
	body('description').notEmpty().withMessage('Description is required'),
	body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
]

const validate = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	next()
}

module.exports = {
	createIndexes,
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	validateProduct,
	productValidationRules,
	validate,
}
