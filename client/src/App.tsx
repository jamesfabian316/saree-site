import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import AdminDashboard from './components/AdminDashboard'
import CheckoutPage from './pages/CheckoutPage'
import { Product } from './types'

function App() {
	const [cartItems, setCartItems] = useState<Product[]>([])
	const [wishlistItems, setWishlistItems] = useState<Product[]>([])

	const addToCart = (product: Product) => {
		// Check if product already exists in cart
		const existingItem = cartItems.find((item) => item.id === product.id)

		if (existingItem) {
			// If product exists, show a notification or handle accordingly
			console.log('Product already in cart')
			return
		}

		// Check if product has stock
		if (product.stock <= 0) {
			console.log('Product out of stock')
			return
		}

		// Add product to cart
		setCartItems((prevItems) => [...prevItems, product])
	}

	const removeFromCart = (productId: number) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
	}

	const updateCartItemQuantity = (productId: number, quantity: number) => {
		setCartItems((prevItems) =>
			prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
		)
	}

	const clearCart = () => {
		setCartItems([])
	}

	const addToWishlist = (product: Product) => {
		// Check if product already exists in wishlist
		const existingItem = wishlistItems.find((item) => item.id === product.id)

		if (existingItem) {
			// If product exists, remove it from wishlist (toggle functionality)
			removeFromWishlist(product.id)
			return
		}

		// Add product to wishlist
		setWishlistItems((prevItems) => [...prevItems, product])
	}

	const removeFromWishlist = (productId: number) => {
		setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))
	}

	const isInWishlist = (productId: number) => {
		return wishlistItems.some((item) => item.id === productId)
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Navbar cartCount={cartItems.length} wishlistCount={wishlistItems.length} />
				<Container maxWidth='lg' sx={{ py: 4 }}>
					<Routes>
						<Route
							path='/'
							element={
								<LandingPage
									addToCart={addToCart}
									addToWishlist={addToWishlist}
									isInWishlist={isInWishlist}
								/>
							}
						/>
						<Route
							path='/product/:id'
							element={
								<ProductPage
									addToCart={addToCart}
									addToWishlist={addToWishlist}
									isInWishlist={isInWishlist}
								/>
							}
						/>
						<Route
							path='/cart'
							element={
								<CartPage
									cartItems={cartItems}
									removeFromCart={removeFromCart}
									updateCartItemQuantity={updateCartItemQuantity}
									clearCart={clearCart}
								/>
							}
						/>
						<Route
							path='/checkout'
							element={<CheckoutPage cart={cartItems} clearCart={clearCart} />}
						/>
						<Route
							path='/wishlist'
							element={
								<WishlistPage
									wishlistItems={wishlistItems}
									removeFromWishlist={removeFromWishlist}
									addToCart={addToCart}
								/>
							}
						/>
						<Route path='/admin' element={<AdminDashboard />} />
					</Routes>
				</Container>
			</Router>
		</ThemeProvider>
	)
}

export default App
