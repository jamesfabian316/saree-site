import React from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../types'

interface ProductCardProps {
	product: Product
	addToCart: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
	return (
		<div className='product-card'>
			<img src={product.image} alt={product.name} />
			<h3>{product.name}</h3>
			<p>Price: ₹{product.price - (product.price * product.discount) / 100}</p>
			<p>Discount: {product.discount}%</p>
			<Link to={`/product/${product.id}`}>View Details</Link>
			<button onClick={() => addToCart(product)}>Add to Cart</button>
		</div>
	)
}

export default ProductCard
