const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

// Checkout route
router.post('/', productController.processCheckout)

module.exports = router
