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

// Drop existing table to recreate with updated schema
db.run('DROP TABLE IF EXISTS products', (err) => {
	if (err) console.error('Error dropping products table:', err)
	console.log('Products table dropped if it existed')

	// Create products table with description field
	db.run(
		`
		CREATE TABLE products (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			price REAL,
			discount REAL,
			category TEXT,
			image TEXT,
			description TEXT
		)
	`,
		(err) => {
			if (err) {
				console.error('Error creating products table:', err)
			} else {
				console.log('Products table created successfully')

				// Seed detailed product data
				const seedData = [
					[
						'Kanchipuram Silk Saree',
						8500,
						15,
						'Silk',
						'/images/kanchipuram-silk.jpg',
						'Handwoven Kanchipuram pure silk saree with real gold zari work. The traditional motifs and temple borders make this saree perfect for weddings and special occasions. Comes with a matching blouse piece.',
					],
					[
						'Banarasi Silk Saree',
						7200,
						10,
						'Silk',
						'/images/banarasi-silk.jpg',
						'Authentic Banarasi silk saree featuring intricate gold and silver zari work. Known for its opulent designs and rich texture, this saree showcases traditional motifs and is perfect for festive occasions.',
					],
					[
						'Mysore Crepe Silk Saree',
						4500,
						12,
						'Silk',
						'/images/mysore-silk.jpg',
						'Lightweight Mysore Crepe silk saree with subtle golden border. The minimalist design makes it suitable for both casual and formal wear. Comfortable to drape for extended periods.',
					],
					[
						'Gadwal Silk Cotton Saree',
						3200,
						8,
						'Silk Cotton',
						'/images/gadwal-silk-cotton.jpg',
						'Handloom Gadwal saree with silk border and cotton body. Features traditional temple designs and contrast pallu. A perfect blend of comfort and elegance suitable for regular wear.',
					],
					[
						'Handloom Cotton Saree',
						1800,
						20,
						'Cotton',
						'/images/handloom-cotton.jpg',
						'Breathable handloom cotton saree with modern geometric patterns. Ideal for summer wear and office use. Comes with a contrast blouse piece and natural vegetable dyes.',
					],
					[
						'Pochampally Ikat Saree',
						3600,
						14,
						'Cotton',
						'/images/pochampally-ikat.jpg',
						'Geometric Pochampally Ikat cotton saree hand-woven by skilled artisans. The unique tie and dye technique creates beautiful diamond patterns. Perfect for casual gatherings and daily wear.',
					],
					[
						'Bomkai Silk Saree',
						5200,
						10,
						'Silk',
						'/images/bomkai-silk.jpg',
						'Tribal Bomkai silk saree from Odisha with traditional fish and conch motifs. Features a contrast pallu and border with intricate embroidery. Ideal for cultural events and festivals.',
					],
					[
						'Chanderi Silk Cotton Saree',
						3900,
						18,
						'Silk Cotton',
						'/images/chanderi-silk-cotton.jpg',
						'Lightweight Chanderi silk cotton blend saree with shimmering texture. Features small buttis (dots) throughout and a delicate zari border. Perfect for both casual and semi-formal occasions.',
					],
					[
						'Linen Saree with Zari Border',
						2800,
						12,
						'Linen',
						'/images/linen-zari.jpg',
						'Premium linen saree with silver zari border. Extremely breathable and comfortable for summer wear. The contemporary design makes it perfect for office wear and casual outings.',
					],
					[
						'Paithani Silk Saree',
						9500,
						8,
						'Silk',
						'/images/paithani-silk.jpg',
						'Traditional Maharashtrian Paithani silk saree with peacock motifs and pallu. Handwoven with pure gold zari work, this heirloom piece is perfect for weddings and special occasions.',
					],
					[
						'Kalamkari Cotton Saree',
						2100,
						15,
						'Cotton',
						'/images/kalamkari-cotton.jpg',
						'Hand-painted Kalamkari cotton saree featuring mythological stories and floral patterns. Uses natural dyes and traditional pen techniques. A wearable art piece for cultural events.',
					],
					[
						'Organza Tissue Saree',
						4300,
						10,
						'Organza',
						'/images/organza-tissue.jpg',
						'Lightweight and translucent organza tissue saree with embroidered flowers. The shimmering effect gives a modern look while maintaining traditional aesthetics. Perfect for evening parties.',
					],
					[
						'Tussar Silk Saree',
						3800,
						12,
						'Silk',
						'/images/tussar-silk.jpg',
						'Natural Tussar silk saree with a distinctive texture and earthy tones. Features handpainted madhubani art on the border and pallu. Ideal for art enthusiasts and casual social gatherings.',
					],
					[
						'Jamdani Cotton Saree',
						2900,
						14,
						'Cotton',
						'/images/jamdani-cotton.jpg',
						'Fine Jamdani cotton saree with intricate floral patterns woven directly into the fabric. This lightweight, breathable saree combines traditional craftsmanship with everyday comfort.',
					],
					[
						'Kerala Kasavu Saree',
						2400,
						15,
						'Cotton',
						'/images/kerala-kasavu.jpg',
						'Traditional Kerala handloom cotton saree with golden kasavu (zari) border. The minimalist white and gold combination makes it perfect for Onam celebrations and religious ceremonies.',
					],
					[
						'Sambalpuri Silk Saree',
						6200,
						12,
						'Silk',
						'/images/sambalpuri-silk.jpg',
						'Handwoven Sambalpuri ikat silk saree from Odisha. Features unique curvilinear patterns created using the double ikat technique. A masterpiece of craftsmanship for special occasions.',
					],
					[
						'Bandhani Georgette Saree',
						3200,
						18,
						'Georgette',
						'/images/bandhani-georgette.jpg',
						'Lightweight georgette saree with traditional Bandhani (tie and dye) patterns. The vibrant colors and tiny dots create a mesmerizing effect. Perfect for festive occasions and celebrations.',
					],
					[
						'Bhagalpuri Tussar Silk Saree',
						4100,
						10,
						'Silk',
						'/images/bhagalpuri-tussar.jpg',
						'Elegant Bhagalpuri Tussar silk saree with digital prints of natural landscapes. The earthy tones and smooth texture make it perfect for everyday elegance and office wear.',
					],
					[
						'Maheshwari Silk Cotton Saree',
						3700,
						15,
						'Silk Cotton',
						'/images/maheshwari-silk-cotton.jpg',
						'Lightweight Maheshwari silk cotton blend saree featuring distinct reversible border. Named after the historic town in Madhya Pradesh, it combines comfort with traditional craftsmanship.',
					],
					[
						'Narayanpet Handloom Saree',
						2600,
						12,
						'Cotton',
						'/images/narayanpet-handloom.jpg',
						'Traditional Narayanpet handloom cotton saree with temple border and chess board patterns on the pallu. The bright colors and simple designs make it perfect for casual and festive wear.',
					],
				]

				// Insert the seed data
				db.serialize(() => {
					const stmt = db.prepare(
						'INSERT INTO products (name, price, discount, category, image, description) VALUES (?, ?, ?, ?, ?, ?)'
					)
					seedData.forEach((data) => stmt.run(data))
					stmt.finalize()
					console.log('Products seeded successfully')
				})
			}
		}
	)
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
