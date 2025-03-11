import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Product } from '../types'

interface ProductPageProps {
	addToCart: (product: Product) => void
}

const ProductPage: React.FC<ProductPageProps> = ({ addToCart }) => {
	const { id } = useParams<{ id: string }>()
	const [product, setProduct] = useState<Product | null>(null)

	useEffect(() => {
		axios.get(`/api/products/${id}`).then((res) => setProduct(res.data))
	}, [id])

	if (!product) return <div>Loading...</div>

	return (
		<div>
			<h1>{product.name}</h1>
			<img src={product.image} alt={product.name} />
			<p>Price: ₹{product.price - (product.price * product.discount) / 100}</p>
			<p>Category: {product.category}</p>
			<button onClick={() => addToCart(product)}>Add to Cart</button>
		</div>
	)
}

export default ProductPage
