import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { Product } from '../types'

interface LandingPageProps {
	addToCart: (product: Product) => void
}

const LandingPage: React.FC<LandingPageProps> = ({ addToCart }) => {
	const [products, setProducts] = useState<Product[]>([])
	const [filters, setFilters] = useState({
		category: '',
		minPrice: '',
		maxPrice: '',
	})

	useEffect(() => {
		axios.get('/api/products', { params: filters }).then((res) => setProducts(res.data))
	}, [filters])

	return (
		<div>
			<h1>Welcome to Saree Shop</h1>
			<div className='discounts'>
				<h2>Special Offers</h2>
				<p>Up to 20% off on selected sarees!</p>
			</div>
			<div className='search-bar'>
				<input
					type='text'
					placeholder='Category'
					value={filters.category}
					onChange={(e) => setFilters({ ...filters, category: e.target.value })}
				/>
				<input
					type='number'
					placeholder='Min Price'
					value={filters.minPrice}
					onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
				/>
				<input
					type='number'
					placeholder='Max Price'
					value={filters.maxPrice}
					onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
				/>
			</div>
			<div className='product-list'>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} addToCart={addToCart} />
				))}
			</div>
		</div>
	)
}

export default LandingPage
