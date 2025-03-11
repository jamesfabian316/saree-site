import { Skeleton, Card, CardContent } from '@mui/material'

const ProductCardSkeleton = () => {
	return (
		<Card sx={{ height: '100%' }}>
			<Skeleton variant='rectangular' height={200} />
			<CardContent>
				<Skeleton variant='text' height={32} />
				<Skeleton variant='text' height={24} />
				<Skeleton variant='text' height={24} />
			</CardContent>
		</Card>
	)
}

export default ProductCardSkeleton
