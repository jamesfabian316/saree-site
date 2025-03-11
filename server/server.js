const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// SQLite database setup
const db = new sqlite3.Database('./db/saree.db', (err) => {
	if (err) console.error(err)
	console.log('Connected to SQLite DB')
})

// Create products table
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    discount REAL,
    category TEXT,
    image TEXT
  )
`)

// Seed some sample data (run this once)
const seedData = [
	['Silk Saree', 1500, 10, 'Silk', 'silk.jpg'],
	['Cotton Saree', 800, 20, 'Cotton', 'cotton.jpg'],
]
db.serialize(() => {
	const stmt = db.prepare(
		'INSERT INTO products (name, price, discount, category, image) VALUES (?, ?, ?, ?, ?)'
	)
	seedData.forEach((data) => stmt.run(data))
	stmt.finalize()
})

// Routes
app.get('/api/products', (req, res) => {
	const { category, minPrice, maxPrice } = req.query
	let query = 'SELECT * FROM products'
	let params = []

	if (category || minPrice || maxPrice) query += ' WHERE '
	if (category) {
		query += 'category = ?'
		params.push(category)
	}
	if (minPrice) {
		query += (params.length ? ' AND ' : '') + 'price >= ?'
		params.push(minPrice)
	}
	if (maxPrice) {
		query += (params.length ? ' AND ' : '') + 'price <= ?'
		params.push(maxPrice)
	}

	db.all(query, params, (err, rows) => {
		if (err) return res.status(500).json({ error: err.message })
		res.json(rows)
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

app.listen(5000, () => console.log('Server running on http://localhost:5000'))
