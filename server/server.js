require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const fs = require('fs')

// Import middleware
const errorHandler = require('./middleware/errorHandler')
const requestLogger = require('./middleware/requestLogger')

// Import database utility
const db = require('./utils/db')

// Import routes
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/categories')
const checkoutRoutes = require('./routes/checkout')

// Initialize express app
const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type'],
		credentials: true,
	})
)

// Request parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Compression middleware
app.use(compression())

// Request logging
app.use(requestLogger)

// Rate limiting
const apiLimiter = rateLimit({
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
	max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: 'Too many requests, please try again later.',
	},
})
app.use('/api/', apiLimiter)

// Serve static files
const imagesPath = path.join(__dirname, '../client/public/images')
console.log('Serving images from:', imagesPath)

// Create public directory if it doesn't exist
const publicPath = path.join(__dirname, 'public')
if (!fs.existsSync(publicPath)) {
	fs.mkdirSync(publicPath, { recursive: true })
}

// Configure CORS for static files
app.use(
	'/images',
	(req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header('Access-Control-Allow-Methods', 'GET')
		res.header('Cross-Origin-Resource-Policy', 'cross-origin')
		next()
	},
	express.static(imagesPath)
)

// Serve test HTML file
app.use('/test', express.static(publicPath))

// Add a route to check image availability
app.get('/check-image/:filename', (req, res) => {
	const filename = req.params.filename
	const imagePath = path.join(imagesPath, filename)

	fs.access(imagePath, fs.constants.F_OK, (err) => {
		if (err) {
			console.log(`Image not found: ${imagePath}`)
			return res.status(404).json({ error: 'Image not found', path: imagePath })
		}
		console.log(`Image exists: ${imagePath}`)
		res.json({ success: true, path: imagePath })
	})
})

// Initialize database
async function initializeDatabase() {
	try {
		// Open database connection
		const dbInstance = await db.initDb()

		console.log('Connected to SQLite DB')

		// Create products table if it doesn't exist
		await dbInstance.run(`
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
		`)

		// Create indexes for better query performance
		await dbInstance.run(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`)
		await dbInstance.run(`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)`)

		console.log('Database initialized successfully')

		return dbInstance
	} catch (err) {
		console.error('Database initialization error:', err)
		process.exit(1)
	}
}

// API routes
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/checkout', checkoutRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Debug endpoint to check image paths in database
app.get('/debug/images', async (req, res) => {
	try {
		const dbInstance = await db.getDb()
		const products = await dbInstance.all('SELECT id, name, image FROM products')

		// Check if each image file exists
		const productsWithImageStatus = await Promise.all(
			products.map(async (product) => {
				let imagePath = product.image
				if (imagePath.startsWith('/images/')) {
					imagePath = imagePath.substring(8) // Remove '/images/' prefix
				}

				const fullPath = path.join(imagesPath, imagePath)
				let exists = false

				try {
					await fs.promises.access(fullPath, fs.constants.F_OK)
					exists = true
				} catch (err) {
					exists = false
				}

				return {
					...product,
					fullImagePath: fullPath,
					imageExists: exists,
				}
			})
		)

		res.json({
			imagesDirectory: imagesPath,
			products: productsWithImageStatus,
		})
	} catch (error) {
		console.error('Debug endpoint error:', error)
		res.status(500).json({ error: error.message })
	}
})

// 404 handler
app.use((req, res, next) => {
	res.status(404).json({ error: 'Not Found' })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000

// Initialize database and start server
initializeDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(
				`Server running in ${
					process.env.NODE_ENV || 'development'
				} mode on http://localhost:${PORT}`
			)
		})
	})
	.catch((err) => {
		console.error('Failed to start server:', err)
	})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
	console.error('Unhandled Promise Rejection:', err)
	// In production, you might want to exit the process
	// process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err)
	// In production, you might want to exit the process
	// process.exit(1)
})
