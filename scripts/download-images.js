const fs = require('fs')
const https = require('https')
const path = require('path')

const imageUrls = {
	'kanchipuram-silk.jpg': 'https://www.example.com/kanchipuram.jpg',
	'banarasi-silk.jpg': 'https://www.example.com/banarasi.jpg',
	// Add more image URLs here
}

const downloadImage = (url, filename) => {
	return new Promise((resolve, reject) => {
		const filepath = path.join(__dirname, '../client/public/images', filename)
		const file = fs.createWriteStream(filepath)

		https
			.get(url, (response) => {
				response.pipe(file)
				file.on('finish', () => {
					file.close()
					console.log(`Downloaded: ${filename}`)
					resolve()
				})
			})
			.on('error', (err) => {
				fs.unlink(filepath, () => {})
				reject(err)
			})
	})
}

async function downloadAllImages() {
	try {
		// Create images directory if it doesn't exist
		const imagesDir = path.join(__dirname, '../client/public/images')
		if (!fs.existsSync(imagesDir)) {
			fs.mkdirSync(imagesDir, { recursive: true })
		}

		// Download all images
		for (const [filename, url] of Object.entries(imageUrls)) {
			await downloadImage(url, filename)
		}
		console.log('All images downloaded successfully!')
	} catch (error) {
		console.error('Error downloading images:', error)
	}
}

downloadAllImages()
