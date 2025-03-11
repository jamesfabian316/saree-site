/**
 * Database initialization script
 * Run this script to create a new database if it doesn't exist
 */

const path = require('path')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

// Ensure the db directory exists
const dbDir = path.join(__dirname, '../db')
if (!fs.existsSync(dbDir)) {
	console.log('Creating db directory...')
	fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'saree.db')
const db = new sqlite3.Database(dbPath)

console.log(`Initializing database at ${dbPath}...`)

// Create tables
db.serialize(() => {
	// Create products table
	db.run(`
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
	db.run(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`)
	db.run(`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)`)

	// Check if products table is empty
	db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
		if (err) {
			console.error('Error checking products count:', err)
			return
		}

		if (row.count === 0) {
			console.log('Adding sample products...')

			// Add sample products
			const sampleProducts = [
				{
					name: 'Tussar Silk Saree',
					price: 5999.99,
					discount: 10,
					category: 'Silk',
					image: '/images/tussar-silk.jpg',
					description: 'Elegant Tussar silk saree with traditional motifs and rich texture.',
					stock: 15,
				},
				{
					name: 'Jamdani Cotton Saree',
					price: 3499.99,
					discount: 5,
					category: 'Cotton',
					image: '/images/jamdani-cotton.jpg',
					description: 'Lightweight Jamdani cotton saree with intricate hand-woven designs.',
					stock: 20,
				},
				{
					name: 'Sambalpuri Silk Saree',
					price: 7999.99,
					discount: 15,
					category: 'Silk',
					image: '/images/sambalpuri-silk.jpg',
					description: 'Traditional Sambalpuri silk saree with distinctive ikat patterns.',
					stock: 10,
				},
				{
					name: 'Bhagalpuri Tussar Saree',
					price: 4999.99,
					discount: 8,
					category: 'Silk Cotton',
					image: '/images/bhagalpuri-tussar.jpg',
					description: 'Beautiful Bhagalpuri tussar saree with natural dyes and patterns.',
					stock: 12,
				},
				{
					name: 'Bomkai Silk Saree',
					price: 8999.99,
					discount: 12,
					category: 'Silk',
					image: '/images/bomkai-silk.jpg',
					description: 'Exquisite Bomkai silk saree with tribal-inspired geometric patterns.',
					stock: 8,
				},
				{
					name: 'Organza Tissue Saree',
					price: 6499.99,
					discount: 7,
					category: 'Linen',
					image: '/images/organza-tissue.jpg',
					description:
						'Lightweight organza tissue saree with shimmering texture and elegant border.',
					stock: 18,
				},
			]

			const stmt = db.prepare(`
        INSERT INTO products (name, price, discount, category, image, description, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)

			sampleProducts.forEach((product) => {
				stmt.run(
					product.name,
					product.price,
					product.discount,
					product.category,
					product.image,
					product.description,
					product.stock
				)
			})

			stmt.finalize()
			console.log('Sample products added successfully!')
		} else {
			console.log(`Database already contains ${row.count} products.`)
		}
	})
})

// Close the database connection
db.close((err) => {
	if (err) {
		console.error('Error closing database:', err)
	} else {
		console.log('Database initialization completed successfully!')
	}
})
