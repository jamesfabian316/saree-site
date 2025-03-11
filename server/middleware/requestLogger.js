const morgan = require('morgan')
const winston = require('winston')
const fs = require('fs')
const path = require('path')

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir)
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' })

// Configure logger
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
	transports: [
		new winston.transports.File({
			filename: path.join(logsDir, 'requests.log'),
			level: 'info',
		}),
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
		}),
	],
})

// Custom token for response time in milliseconds
morgan.token('response-time-ms', (req, res) => {
	if (!req._startAt || !res._startAt) {
		return ''
	}

	const ms = (res._startAt[0] - req._startAt[0]) * 1000 + (res._startAt[1] - req._startAt[1]) * 1e-6

	return ms.toFixed(2)
})

// Custom format that includes more information
const customFormat =
	':remote-addr - :method :url :status :response-time-ms ms - :res[content-length] - :user-agent'

// Development logger - colorful console output
const developmentLogger = morgan('dev')

// Production logger - detailed file output
const productionLogger = morgan(customFormat, { stream: accessLogStream })

// Request logging middleware
const requestLogger = (req, res, next) => {
	// Mark the start time
	req._startAt = process.hrtime()

	// Add listener for response finish
	res.on('finish', () => {
		res._startAt = process.hrtime()

		// Log additional information for certain status codes
		if (res.statusCode >= 400) {
			logger.warn(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
				ip: req.ip,
				userAgent: req.get('user-agent'),
				body: req.method !== 'GET' ? req.body : undefined,
				params: req.params,
				query: req.query,
			})
		}
	})

	// Use appropriate logger based on environment
	if (process.env.NODE_ENV === 'production') {
		return productionLogger(req, res, next)
	} else {
		return developmentLogger(req, res, next)
	}
}

module.exports = requestLogger
