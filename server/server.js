require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

// Import middleware
const errorHandler = require('./middleware/errorHandler')
const requestLogger = require('./middleware/requestLogger')

// Import database utility
const db = require('./utils/db')

// Import routes
const productRoutes = require('./routes/products')

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
app.use('/images', express.static(path.join(__dirname, '../client/public/images')))

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

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
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
