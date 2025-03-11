const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/saree.db')

// Check if the database file exists
const fs = require('fs')
if (!fs.existsSync('./db/saree.db')) {
	console.error('Database file does not exist at ./db/saree.db')
	process.exit(1)
}

// Query products
db.all('SELECT id, name, image FROM products', (err, rows) => {
	if (err) {
		console.error('Error querying database:', err)
	} else {
		console.log('Products in database:')
		console.log(JSON.stringify(rows, null, 2))
	}

	// Close the database connection
	db.close()
})
