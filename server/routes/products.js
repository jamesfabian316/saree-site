const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const productController = require('../controllers/productController')
const { productValidationRules, validate } = require('../models/productModel')

const router = express.Router()

// Ensure upload directory exists
const uploadPath = path.join(__dirname, '../../client/public/images')
if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath, { recursive: true })
	console.log('Created upload directory:', uploadPath)
}

// Configure file upload storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
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
		console.log('=== Multer File Filter ===')
		console.log('File:', file)

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

		// Check file type
		if (!allowedTypes.includes(file.mimetype)) {
			console.log('Invalid file type:', file.mimetype)
			return cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'), false)
		}

		console.log('File type accepted:', file.mimetype)
		cb(null, true)
	},
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
})

// Configure multer for test uploads (using memory storage for debugging)
const testUpload = multer({
	storage: multer.memoryStorage(),
	fileFilter: (req, file, cb) => {
		console.log('=== Multer File Filter ===')
		console.log('File:', file)

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

		// Check file type
		if (!allowedTypes.includes(file.mimetype)) {
			console.log('Invalid file type:', file.mimetype)
			return cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'), false)
		}

		console.log('File type accepted:', file.mimetype)
		cb(null, true)
	},
})

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		return res.status(400).json({
			error: true,
			message: `Upload error: ${err.message}`,
		})
	} else if (err) {
		return res.status(400).json({
			error: true,
			message: err.message,
		})
	}
	next()
}

// Public routes
router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProductById)

// Test upload endpoint with enhanced logging
router.post('/test-upload', (req, res, next) => {
	console.log('=== Test Upload Request Received ===')
	console.log('Request Headers:', JSON.stringify(req.headers, null, 2))
	console.log('Content-Type:', req.headers['content-type'])
	console.log('Content-Length:', req.headers['content-length'])
	console.log('=== End Initial Request Info ===')

	testUpload.single('image')(req, res, function (err) {
		console.log('=== Upload Processing ===')
		if (err) {
			console.error('Upload Error:', err)
			return res.status(400).json({
				success: false,
				message: err.message,
			})
		}

		console.log('Request Body:', req.body)
		if (req.file) {
			console.log('File received:', {
				fieldname: req.file.fieldname,
				originalname: req.file.originalname,
				encoding: req.file.encoding,
				mimetype: req.file.mimetype,
				size: req.file.size,
			})
		} else {
			console.log('No file received')
		}

		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: 'No file was uploaded',
				requestInfo: {
					headers: req.headers,
					body: req.body,
				},
			})
		}

		console.log('File received successfully')
		console.log('=== End Upload Processing ===')

		res.status(200).json({
			success: true,
			message: 'Test upload received',
			file: {
				fieldname: req.file.fieldname,
				originalname: req.file.originalname,
				encoding: req.file.encoding,
				mimetype: req.file.mimetype,
				size: req.file.size,
			},
		})
	})
})

// Checkout route
router.post('/checkout', productController.processCheckout)

// Admin routes with enhanced error handling
router.post(
	'/admin',
	upload.single('image'),
	handleMulterError,
	productValidationRules,
	validate,
	async (req, res, next) => {
		try {
			console.log('=== Product Creation Request ===')
			console.log('Headers:', JSON.stringify(req.headers, null, 2))
			console.log('Body:', JSON.stringify(req.body, null, 2))
			console.log('File:', req.file ? JSON.stringify(req.file, null, 2) : 'No file uploaded')
			console.log('=== End Product Creation Request ===')

			await productController.createProduct(req, res, next)
		} catch (error) {
			next(error)
		}
	}
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
