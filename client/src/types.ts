export interface Product {
	id: number
	name: string
	description: string
	price: number
	discount: number
	image: string
	category: string
	stock: number
	quantity?: number
	createdAt?: string
	updatedAt?: string
}
