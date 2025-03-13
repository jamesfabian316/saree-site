import { Link as RouterLink } from 'react-router-dom'
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Badge,
	Box,
	Container,
	IconButton,
	useScrollTrigger,
	Slide,
	useTheme,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HomeIcon from '@mui/icons-material/Home'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

interface NavbarProps {
	cartCount: number
	wishlistCount: number
}

// Hide on scroll effect
function HideOnScroll(props: { children: React.ReactElement }) {
	const { children } = props
	const trigger = useScrollTrigger()

	return (
		<Slide appear={false} direction='down' in={!trigger}>
			{children}
		</Slide>
	)
}

const Navbar = ({ cartCount, wishlistCount }: NavbarProps) => {
	const theme = useTheme()

	return (
		<HideOnScroll>
			<AppBar position='sticky'>
				<Container maxWidth='lg'>
					<Toolbar
						disableGutters
						sx={{
							justifyContent: 'space-between',
							py: 1,
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Typography
								variant='h5'
								component={RouterLink}
								to='/'
								sx={{
									textDecoration: 'none',
									fontWeight: 700,
									color: 'primary.main',
									display: 'flex',
									alignItems: 'center',
									letterSpacing: '-0.5px',
								}}
							>
								<Box
									component='span'
									sx={{
										display: 'inline-flex',
										mr: 1,
										transform: 'rotate(-5deg)',
									}}
								>
									<LocalShippingIcon
										fontSize='small'
										sx={{
											color: 'primary.main',
											fontSize: '1.2rem',
										}}
									/>
								</Box>
								Textile Hub
							</Typography>
						</Box>

						<Box
							sx={{
								display: 'flex',
								gap: { xs: 1, sm: 2 },
								alignItems: 'center',
							}}
						>
							<Button
								component={RouterLink}
								to='/'
								color='primary'
								sx={{
									fontWeight: 500,
									display: { xs: 'none', sm: 'flex' },
								}}
								startIcon={<HomeIcon />}
							>
								Home
							</Button>

							<IconButton
								component={RouterLink}
								to='/wishlist'
								color='primary'
								sx={{
									opacity: wishlistCount > 0 ? 1 : 0.6,
								}}
							>
								<Badge
									badgeContent={wishlistCount}
									sx={{
										'& .MuiBadge-badge': {
											bgcolor: 'primary.main',
											color: 'primary.contrastText',
											fontWeight: 'bold',
											fontSize: '0.7rem',
										},
									}}
								>
									<FavoriteIcon />
								</Badge>
							</IconButton>

							<IconButton
								component={RouterLink}
								to='/cart'
								color='primary'
								sx={{
									opacity: cartCount > 0 ? 1 : 0.6,
								}}
							>
								<Badge
									badgeContent={cartCount}
									sx={{
										'& .MuiBadge-badge': {
											bgcolor: 'primary.main',
											color: 'primary.contrastText',
											fontWeight: 'bold',
											fontSize: '0.7rem',
										},
									}}
								>
									<ShoppingCartIcon />
								</Badge>
							</IconButton>

							<IconButton component={RouterLink} to='/admin' color='primary'>
								<AdminPanelSettingsIcon />
							</IconButton>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
		</HideOnScroll>
	)
}

export default Navbar
