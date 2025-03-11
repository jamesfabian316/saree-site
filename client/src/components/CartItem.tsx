import React from 'react'
import { Product } from '../types'

interface CartItemProps {
	item: Product
	onRemove: () => void
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
	return (
		<div className='cart-item'>
			<h3>{item.name}</h3>
			<p>Price: ₹{item.price - (item.price * item.discount) / 100}</p>
			<button onClick={onRemove}>Remove</button>
		</div>
	)
}

export default CartItem
