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
	Avatar,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HomeIcon from '@mui/icons-material/Home'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { alpha } from '@mui/material/styles'

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
	return (
		<HideOnScroll>
			<AppBar
				position='sticky'
				sx={{
					bgcolor: 'white',
					borderBottom: '1px solid rgba(255, 77, 143, 0.1)',
				}}
				elevation={0}
			>
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
									background: 'linear-gradient(45deg, #FF4D8F 30%, #9C27B0 90%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									textFillColor: 'transparent',
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
									<FavoriteIcon
										fontSize='small'
										sx={{
											color: '#FF4D8F',
											fontSize: '1.2rem',
										}}
									/>
								</Box>
								Saree Elegance
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
								color='inherit'
								sx={{
									color: 'text.primary',
									fontWeight: 500,
									display: { xs: 'none', sm: 'flex' },
									'&:hover': {
										color: 'primary.main',
									},
								}}
								startIcon={<HomeIcon />}
							>
								Home
							</Button>

							<IconButton
								component={RouterLink}
								to='/wishlist'
								sx={{
									position: 'relative',
									color: wishlistCount > 0 ? 'error.main' : 'text.secondary',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-3px)',
										bgcolor: alpha('#FF4D8F', 0.08),
									},
								}}
							>
								<Badge
									badgeContent={wishlistCount}
									color='error'
									sx={{
										'& .MuiBadge-badge': {
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
								sx={{
									position: 'relative',
									color: cartCount > 0 ? 'primary.main' : 'text.secondary',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-3px)',
										bgcolor: alpha('#FF4D8F', 0.08),
									},
								}}
							>
								<Badge
									badgeContent={cartCount}
									color='primary'
									sx={{
										'& .MuiBadge-badge': {
											fontWeight: 'bold',
											fontSize: '0.7rem',
										},
									}}
								>
									<ShoppingCartIcon />
								</Badge>
							</IconButton>

							<IconButton
								component={RouterLink}
								to='/admin'
								color='inherit'
								sx={{
									color: 'secondary.main',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-3px)',
										bgcolor: alpha('#9C27B0', 0.08),
									},
								}}
							>
								<AdminPanelSettingsIcon />
							</IconButton>

							<Avatar
								sx={{
									width: 32,
									height: 32,
									bgcolor: '#FFF9FC',
									border: '2px solid #FF4D8F',
									color: '#FF4D8F',
									fontWeight: 'bold',
									fontSize: '0.9rem',
									display: { xs: 'none', sm: 'flex' },
									cursor: 'pointer',
									'&:hover': {
										bgcolor: 'rgba(255, 77, 143, 0.1)',
									},
								}}
							>
								J
							</Avatar>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
		</HideOnScroll>
	)
}

export default Navbar
