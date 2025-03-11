const winston = require('winston')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs')
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true })
}

// Configure logger
const logger = winston.createLogger({
	level: 'error',
	format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
	transports: [
		new winston.transports.File({ filename: path.join(logsDir, 'error.log') }),
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
		}),
	],
})

/**
 * Error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function errorHandler(err, req, res, next) {
	// Log error details
	logger.error({
		message: err.message,
		url: req.originalUrl,
		method: req.method,
		ip: req.ip,
		stack: err.stack,
		body: req.body,
		params: req.params,
		query: req.query,
	})

	console.error('Error details:', {
		message: err.message,
		url: req.originalUrl,
		method: req.method,
		stack: err.stack,
	})

	// Handle specific error types
	if (err instanceof multer.MulterError) {
		// Multer error (file upload)
		if (err.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({
				message: 'File size exceeds the limit (5MB)',
				error: 'LIMIT_FILE_SIZE',
			})
		}
		return res.status(400).json({
			message: `File upload error: ${err.message}`,
			error: err.code,
		})
	}

	// Handle custom errors with status codes
	if (err.status) {
		return res.status(err.status).json({
			message: err.message,
			error: err.name || 'CustomError',
		})
	}

	// Handle validation errors
	if (err.name === 'ValidationError') {
		return res.status(400).json({
			message: err.message,
			error: 'ValidationError',
		})
	}

	// Handle SQLite errors
	if (err.code && err.code.startsWith('SQLITE_')) {
		return res.status(500).json({
			message: 'Database error occurred',
			error: err.code,
			details: process.env.NODE_ENV === 'development' ? err.message : undefined,
		})
	}

	// Default error response
	const statusCode = err.statusCode || 500
	res.status(statusCode).json({
		message: err.message || 'Internal Server Error',
		error: err.name || 'ServerError',
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
	})
}

module.exports = errorHandler
