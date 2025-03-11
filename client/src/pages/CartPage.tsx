import React from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { Product } from '../types'

interface CartPageProps {
	cart: Product[]
	setCart: React.Dispatch<React.SetStateAction<Product[]>>
}

const CartPage: React.FC<CartPageProps> = ({ cart, setCart }) => {
	const total = cart.reduce(
		(sum, item) => sum + (item.price - (item.price * item.discount) / 100),
		0
	)

	const removeFromCart = (itemToRemove: Product) => {
		setCart(cart.filter((item) => item !== itemToRemove))
	}

	return (
		<div>
			<h1>Your Cart</h1>
			{cart.length === 0 ? (
				<p>Cart is empty</p>
			) : (
				<>
					{cart.map((item, index) => (
						<CartItem key={index} item={item} onRemove={() => removeFromCart(item)} />
					))}
					<p>Total: ₹{total.toFixed(2)}</p>
					<Link to='/checkout'>Proceed to Checkout</Link>
				</>
			)}
		</div>
	)
}

export default CartPage
