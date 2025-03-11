import React, { useState } from 'react'
import axios from 'axios'
import { Product } from '../types'

interface CheckoutPageProps {
	cart: Product[]
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart }) => {
	const [orderPlaced, setOrderPlaced] = useState(false)

	const handleCheckout = () => {
		axios.post('/api/checkout', { cart }).then((res) => {
			setOrderPlaced(true)
			alert(res.data.message)
		})
	}

	const total = cart.reduce(
		(sum, item) => sum + (item.price - (item.price * item.discount) / 100),
		0
	)

	return (
		<div>
			<h1>Checkout</h1>
			{orderPlaced ? (
				<p>Thank you for your order!</p>
			) : (
				<>
					<p>Total: ₹{total.toFixed(2)}</p>
					<button onClick={handleCheckout}>Place Order (Mock Payment)</button>
				</>
			)}
		</div>
	)
}

export default CheckoutPage
