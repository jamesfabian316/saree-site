const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

const sareeTypes = [
	'kanchipuram-silk',
	'banarasi-silk',
	'mysore-silk',
	'gadwal-silk-cotton',
	'handloom-cotton',
	'pochampally-ikat',
	'bomkai-silk',
	'chanderi-silk-cotton',
	'linen-zari',
	'paithani-silk',
	'kalamkari-cotton',
	'organza-tissue',
	'tussar-silk',
	'jamdani-cotton',
	'kerala-kasavu',
	'sambalpuri-silk',
	'bandhani-georgette',
	'bhagalpuri-tussar',
	'maheshwari-silk-cotton',
	'narayanpet-handloom',
]

function generatePlaceholderImage(name) {
	const width = 500
	const height = 700
	const canvas = createCanvas(width, height)
	const ctx = canvas.getContext('2d')

	// Background
	ctx.fillStyle = '#f0f0f0'
	ctx.fillRect(0, 0, width, height)

	// Border
	ctx.strokeStyle = '#666666'
	ctx.lineWidth = 10
	ctx.strokeRect(5, 5, width - 10, height - 10)

	// Text
	ctx.fillStyle = '#333333'
	ctx.font = '30px Arial'
	ctx.textAlign = 'center'

	// Format the name for display
	const displayName = name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')

	// Draw text
	ctx.fillText(displayName, width / 2, height / 2)
	ctx.font = '20px Arial'
	ctx.fillText('Placeholder Image', width / 2, height / 2 + 40)

	return canvas
}

async function generateAllImages() {
	try {
		// Create images directory if it doesn't exist
		const imagesDir = path.join(__dirname, '../client/public/images')
		if (!fs.existsSync(imagesDir)) {
			fs.mkdirSync(imagesDir, { recursive: true })
		}

		// Generate images for each saree type
		for (const sareeType of sareeTypes) {
			const canvas = generatePlaceholderImage(sareeType)
			const buffer = canvas.toBuffer('image/jpeg')
			fs.writeFileSync(path.join(imagesDir, `${sareeType}.jpg`), buffer)
			console.log(`Generated: ${sareeType}.jpg`)
		}

		console.log('All placeholder images generated successfully!')
	} catch (error) {
		console.error('Error generating images:', error)
	}
}

generateAllImages()
