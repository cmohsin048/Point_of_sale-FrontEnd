import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedOut } from '../reducer/Authslice';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
const Adminpages = [
    { label: "Dashboard", route: "/Admindashboard" },
    { label: 'Add Products', route: '/Addproduct' },
    { label: 'Add User', route: '/register' },
    { label: 'Add Store', route: '/Addstore' },
    {label:"Add Sales" , route:'/Sale'},
    {label:"Add Purchase" , route:'/Purchase'},


];
const Managerpages = [
    { label: "Dashboard", route: "/ManagerDashboard" },
    { label: 'Add Products', route: '/Addproduct' },
    {label:"Add Sales" , route:'/Sale'},
    {label:"Add Purchase" , route:'/Purchase'},
    {label:"Add Expense" , route:'/addExpenses'}

    
];
const Employeepages = [
    { label: "Dashboard", route: "/Employeedashboard" },
    {label:"Add Sales" , route:'/Sale'},
    {label:"Add Purchase" , route:'/Purchase'},
    {label:"Add Expense" , route:'/addExpenses'}

];
const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleSettingClick = (setting) => {

        if (setting === 'Profile') {

        } else if (setting === 'Account') {

        } else if (setting === 'Dashboard') {

        } else if (setting === 'Logout') {
            dispatch(setLoggedOut())
            localStorage.removeItem('isLoggedIn');
            navigate('/')
            // localStorage.removeItem('token');
            // // Redirect the user to the login page or any other desired page
            // window.location.href = '/';

        }
    };
    const jwt = localStorage.getItem('token');
    const decoded = jwtDecode(jwt);
    const userRole = decoded.role;

    const userPages = {
        Admin: Adminpages,
        Manager: Managerpages,
        Employee: Employeepages,
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {userPages[userRole].map((page) => (
                            <Link key={page.label} to={page.route} style={{ textDecoration: 'none' }}>
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'black', display: 'block' }}
                                >
                                    {page.label}
                                </Button>
                            </Link>
                        ))}

                        </Menu>
                    </Box>
                    <StorefrontTwoToneIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        // href={isLoggedIn && "/Addstore"}
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <StorefrontTwoToneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        // href={isLoggedIn && "/Addstore"}
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        POS
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {userPages[userRole].map((page) => (
                            <Link key={page.label} to={page.route} style={{ textDecoration: 'none' }}>
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.label}
                                </Button>
                            </Link>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
