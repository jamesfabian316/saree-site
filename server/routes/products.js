const express = require('express')
const multer = require('multer')
const path = require('path')
const productController = require('../controllers/productController')
const { productValidationRules, validate } = require('../models/productModel')

const router = express.Router()

// Configure file upload storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(__dirname, '../../client/public/images')
		cb(null, uploadPath)
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
	},
})

// Configure multer
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

// Public routes
router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProductById)

// Checkout route
router.post('/checkout', productController.processCheckout)

// Admin routes
router.post(
	'/admin',
	upload.single('image'),
	productValidationRules,
	validate,
	productController.createProduct
)

router.put(
	'/admin/:id',
	upload.single('image'),
	productValidationRules,
	validate,
	productController.updateProduct
)

router.delete('/admin/:id', productController.deleteProduct)

module.exports = router
