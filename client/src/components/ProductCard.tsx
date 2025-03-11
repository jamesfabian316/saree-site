import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../types'

interface ProductCardProps {
	product: Product
	addToCart: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
	const [imageError, setImageError] = useState(false)

	const handleImageError = () => {
		setImageError(true)
		console.error(`Failed to load image for ${product.name}`)
	}

	return (
		<div className='product-card'>
			<div className='product-image-container'>
				{!imageError ? (
					<img
						src={product.image}
						alt={product.name}
						onError={handleImageError}
						className='product-image'
					/>
				) : (
					<div className='image-placeholder'>
						<span>{product.name}</span>
					</div>
				)}
			</div>
			<div className='product-details'>
				<h3>{product.name}</h3>
				<p className='product-price'>
					₹{(product.price - (product.price * product.discount) / 100).toFixed(2)}
					{product.discount > 0 && (
						<span className='original-price'>₹{product.price.toFixed(2)}</span>
					)}
				</p>
				{product.discount > 0 && <p className='discount-tag'>{product.discount}% OFF</p>}
				<div className='product-actions'>
					<Link to={`/product/${product.id}`} className='view-details-btn'>
						View Details
					</Link>
					<button onClick={() => addToCart(product)} className='add-to-cart-btn'>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProductCard
