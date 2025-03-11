import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import LandingPage from './pages/LandingPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage.tsx'
import { Product } from './types'

const App: React.FC = () => {
	const [cart, setCart] = useState<Product[]>([])

	const addToCart = (product: Product) => {
		setCart([...cart, product])
	}

	return (
		<Router>
			<Navbar cartCount={cart.length} />
			<Routes>
				<Route path='/' element={<LandingPage addToCart={addToCart} />} />
				<Route path='/product/:id' element={<ProductPage addToCart={addToCart} />} />
				<Route path='/cart' element={<CartPage cart={cart} setCart={setCart} />} />
				<Route path='/checkout' element={<CheckoutPage cart={cart} />} />
			</Routes>
		</Router>
	)
}

export default App
