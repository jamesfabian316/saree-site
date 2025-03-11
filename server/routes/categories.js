const express = require('express')
const router = express.Router()
const db = require('../utils/db')

// Get all unique categories from products
router.get('/', async (req, res, next) => {
	try {
		const dbInstance = await db.getDb()
		const result = await dbInstance.all('SELECT DISTINCT category FROM products')

		// Extract categories from result
		const categories = result.map((item) => item.category)

		res.json(categories)
	} catch (error) {
		next(error)
	}
})

module.exports = router
