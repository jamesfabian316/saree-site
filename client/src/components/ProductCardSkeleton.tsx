import { Skeleton, Card, CardContent, Box } from '@mui/material'
import { alpha } from '@mui/material/styles'

const ProductCardSkeleton = () => {
	return (
		<Card
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				overflow: 'visible',
				borderRadius: 4,
				border: '1px solid',
				borderColor: 'divider',
				transition: 'all 0.3s ease',
				'&:hover': {
					transform: 'translateY(-5px)',
					boxShadow: (theme) => `0 16px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
				},
			}}
		>
			<Box
				sx={{
					position: 'relative',
					overflow: 'hidden',
					borderTopLeftRadius: 16,
					borderTopRightRadius: 16,
					boxShadow: (theme) => `inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.1)}`,
				}}
			>
				<Skeleton
					variant='rectangular'
					height={280}
					animation='wave'
					sx={{
						transform: 'scale(1.02)',
						bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
					}}
				/>
			</Box>
			<CardContent sx={{ flexGrow: 1, pt: 2.5, pb: 1.5 }}>
				<Skeleton
					variant='text'
					height={32}
					width='80%'
					animation='wave'
					sx={{ mb: 1, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) }}
				/>
				<Skeleton
					variant='text'
					height={24}
					animation='wave'
					sx={{ mb: 1, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06) }}
				/>
				<Skeleton
					variant='text'
					height={24}
					width='60%'
					animation='wave'
					sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06) }}
				/>
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Skeleton
						variant='rectangular'
						width={80}
						height={32}
						animation='wave'
						sx={{ borderRadius: 1, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) }}
					/>
					<Skeleton
						variant='rectangular'
						width={100}
						height={36}
						animation='wave'
						sx={{ borderRadius: 6, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) }}
					/>
				</Box>
			</CardContent>
		</Card>
	)
}

export default ProductCardSkeleton
