import React from 'react'
import { Link } from 'react-router-dom'

interface NavbarProps {
	cartCount: number
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
	return (
		<nav>
			<Link to='/'>Saree Shop</Link>
			<div>
				<Link to='/cart'>Cart ({cartCount})</Link>
			</div>
		</nav>
	)
}

export default Navbar
