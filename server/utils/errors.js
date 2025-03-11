/**
 * Custom error for validation failures
 */
class ValidationError extends Error {
	constructor(message) {
		super(message)
		this.name = 'ValidationError'
		this.status = 400
	}
}

/**
 * Custom error for not found resources
 */
class NotFoundError extends Error {
	constructor(message = 'Resource not found') {
		super(message)
		this.name = 'NotFoundError'
		this.status = 404
	}
}

/**
 * Custom error for unauthorized access
 */
class UnauthorizedError extends Error {
	constructor(message = 'Unauthorized access') {
		super(message)
		this.name = 'UnauthorizedError'
		this.status = 401
	}
}

/**
 * Custom error for forbidden access
 */
class ForbiddenError extends Error {
	constructor(message = 'Forbidden access') {
		super(message)
		this.name = 'ForbiddenError'
		this.status = 403
	}
}

/**
 * Custom error for conflict situations
 */
class ConflictError extends Error {
	constructor(message) {
		super(message)
		this.name = 'ConflictError'
		this.status = 409
	}
}

/**
 * Custom error for server errors
 */
class ServerError extends Error {
	constructor(message = 'Internal server error') {
		super(message)
		this.name = 'ServerError'
		this.status = 500
	}
}

module.exports = {
	ValidationError,
	NotFoundError,
	UnauthorizedError,
	ForbiddenError,
	ConflictError,
	ServerError,
}
