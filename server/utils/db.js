const sqlite3 = require('sqlite3').verbose()
const sqlite = require('sqlite')
const path = require('path')

let _db = null

/**
 * Initialize the database connection
 * @returns {Promise<sqlite.Database>} The database connection
 */
async function initDb() {
	if (_db) return _db

	try {
		const dbPath = process.env.DB_PATH || path.join(__dirname, '../../db/saree.db')

		// Ensure the directory exists
		const fs = require('fs')
		const dbDir = path.dirname(dbPath)
		if (!fs.existsSync(dbDir)) {
			fs.mkdirSync(dbDir, { recursive: true })
		}

		// Open database connection
		_db = await sqlite.open({
			filename: dbPath,
			driver: sqlite3.Database,
		})

		return _db
	} catch (err) {
		console.error('Database initialization error:', err)
		throw err
	}
}

/**
 * Get the database connection
 * @returns {Promise<sqlite.Database>} The database connection
 */
async function getDb() {
	if (!_db) {
		return await initDb()
	}
	return _db
}

/**
 * Close the database connection
 * @returns {Promise<void>}
 */
async function closeDb() {
	if (_db) {
		await _db.close()
		_db = null
	}
}

/**
 * Run a query with parameters
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<any>} - Query result
 */
async function run(sql, params = []) {
	try {
		const db = await getDb()
		console.log('Executing SQL:', sql)
		console.log('With parameters:', params)
		const result = await db.run(sql, params)
		console.log('SQL execution result:', result)
		return result
	} catch (error) {
		console.error('Database error in run():', error.message)
		console.error('SQL:', sql)
		console.error('Parameters:', params)
		throw error
	}
}

/**
 * Get a single row from a query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<any>} - Query result
 */
async function get(sql, params = []) {
	try {
		const db = await getDb()
		console.log('Executing SQL (get):', sql)
		console.log('With parameters:', params)
		const result = await db.get(sql, params)
		return result
	} catch (error) {
		console.error('Database error in get():', error.message)
		console.error('SQL:', sql)
		console.error('Parameters:', params)
		throw error
	}
}

/**
 * Get all rows from a query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<any[]>} - Query results
 */
async function all(sql, params = []) {
	try {
		const db = await getDb()
		console.log('Executing SQL (all):', sql)
		console.log('With parameters:', params)
		const results = await db.all(sql, params)
		return results
	} catch (error) {
		console.error('Database error in all():', error.message)
		console.error('SQL:', sql)
		console.error('Parameters:', params)
		throw error
	}
}

/**
 * Execute a transaction
 * @param {Function} callback - Transaction callback
 * @returns {Promise<any>} - Transaction result
 */
async function transaction(callback) {
	const db = await getDb()
	await db.run('BEGIN TRANSACTION')

	try {
		const result = await callback(db)
		await db.run('COMMIT')
		return result
	} catch (error) {
		await db.run('ROLLBACK')
		throw error
	}
}

module.exports = {
	initDb,
	getDb,
	closeDb,
	run,
	get,
	all,
	transaction,
}
