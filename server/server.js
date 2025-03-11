const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const fs = require('fs')
const app = express()

app.use(
	cors({
		origin: 'http://localhost:5173', // Vite's default port
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type'],
	})
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configure file upload storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../client/public/images'))
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
	},
})
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true)
		} else {
			cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'))
		}
	},
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
})

// Serve static files from the client/public directory
app.use('/images', express.static(path.join(__dirname, '../client/public/images')))

// SQLite database setup
const db = new sqlite3.Database('./db/saree.db', (err) => {
	if (err) console.error(err)
	console.log('Connected to SQLite DB')
})

// Create products table if it doesn't exist
db.run(
	`
	CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		price REAL,
		discount REAL,
		category TEXT,
		image TEXT,
		description TEXT,
		stock INTEGER DEFAULT 0
	)
`,
	(err) => {
		if (err) {
			console.error('Error creating products table:', err)
		} else {
			console.log('Products table created successfully')
		}
	}
)

// Add rate limiting
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
})
app.use('/api/', apiLimiter)

// Add helmet for security headers
app.use(helmet())

// Add validation middleware
const validateProduct = (req, res, next) => {
	const { name, price, discount, category, description, stock } = req.body

	if (
		!name ||
		!price ||
		discount === undefined ||
		!category ||
		!description ||
		stock === undefined
	) {
		return res.status(400).json({ error: 'All fields are required' })
	}

	if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
		return res.status(400).json({ error: 'Price must be a positive number' })
	}

	if (isNaN(parseFloat(discount)) || parseFloat(discount) < 0 || parseFloat(discount) > 100) {
		return res.status(400).json({ error: 'Discount must be a number between 0 and 100' })
	}

	if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
		return res.status(400).json({ error: 'Stock must be a non-negative integer' })
	}

	next()
}

// Routes
app.get('/api/products', (req, res) => {
	const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query
	const offset = (page - 1) * limit

	let query = 'SELECT * FROM products'
	let countQuery = 'SELECT COUNT(*) as total FROM products'
	let params = []
	let whereClause = ''

	if (category || minPrice || maxPrice) {
		whereClause = ' WHERE '
		if (category) {
			whereClause += 'category = ?'
			params.push(category)
		}
		if (minPrice) {
			whereClause += (params.length ? ' AND ' : '') + 'price >= ?'
			params.push(minPrice)
		}
		if (maxPrice) {
			whereClause += (params.length ? ' AND ' : '') + 'price <= ?'
			params.push(maxPrice)
		}
	}

	query += whereClause + ' LIMIT ? OFFSET ?'
	countQuery += whereClause
	params.push(limit, offset)

	db.get(countQuery, params.slice(0, -2), (err, row) => {
		if (err) return res.status(500).json({ error: err.message })

		const total = row.total

		db.all(query, params, (err, rows) => {
			if (err) return res.status(500).json({ error: err.message })
			res.json({
				products: rows,
				pagination: {
					total,
					page: parseInt(page),
					limit: parseInt(limit),
					totalPages: Math.ceil(total / limit),
				},
			})
		})
	})
})

app.get('/api/products/:id', (req, res) => {
	db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
		if (err) return res.status(500).json({ error: err.message })
		res.json(row)
	})
})

app.post('/api/checkout', (req, res) => {
	// Mock checkout process
	const { cart } = req.body
	res.json({ message: 'Order placed successfully!', orderId: Math.floor(Math.random() * 10000) })
})

// Admin Routes
app.post('/api/admin/products', upload.single('image'), validateProduct, (req, res) => {
	const { name, price, discount, category, description, stock } = req.body
	const image = `/images/${req.file.filename}`

	db.run(
		'INSERT INTO products (name, price, discount, category, image, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[name, price, discount, category, image, description, stock],
		function (err) {
			if (err) return res.status(500).json({ error: err.message })
			res.json({ id: this.lastID, message: 'Product created successfully' })
		}
	)
})

app.put('/api/admin/products/:id', upload.single('image'), validateProduct, (req, res) => {
	const { id } = req.params
	const { name, price, discount, category, description, stock } = req.body

	// Check if product exists
	db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
		if (err) return res.status(500).json({ error: err.message })
		if (!row) return res.status(404).json({ error: 'Product not found' })

		let image = row.image
		if (req.file) {
			// Delete old image if it exists and is not the default
			if (row.image && !row.image.includes('saree')) {
				deleteImageFile(row.image)
			}
			image = `/images/${req.file.filename}`
		}

		db.run(
			'UPDATE products SET name = ?, price = ?, discount = ?, category = ?, image = ?, description = ?, stock = ? WHERE id = ?',
			[name, price, discount, category, image, description, stock, id],
			(err) => {
				if (err) return res.status(500).json({ error: err.message })
				res.json({ message: 'Product updated successfully' })
			}
		)
	})
})

// Add function to delete image file
const deleteImageFile = (imagePath) => {
	const fullPath = path.join(__dirname, '../client/public', imagePath)
	fs.unlink(fullPath, (err) => {
		if (err) console.error('Error deleting image file:', err)
	})
}

// Update delete route
app.delete('/api/admin/products/:id', (req, res) => {
	const { id } = req.params

	// First get the product to get the image path
	db.get('SELECT image FROM products WHERE id = ?', [id], (err, row) => {
		if (err) return res.status(500).json({ error: err.message })
		if (!row) return res.status(404).json({ error: 'Product not found' })

		// Delete the product
		db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
			if (err) return res.status(500).json({ error: err.message })

			// Delete the image file
			deleteImageFile(row.image)

			res.json({ message: 'Product deleted successfully' })
		})
	})
})

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(5000, () => console.log('Server running on http://localhost:5000'))
