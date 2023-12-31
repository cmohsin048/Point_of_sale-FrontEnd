import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import jwtDecode from 'jwt-decode';

const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [store, setStore] = useState('');
    const [storeList, setStoreList] = useState([]);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
      };
    const jwt = localStorage.getItem('token');
    const decoded=jwtDecode(jwt)
    const userrole=decoded.role

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let requestPayload = {
                userName,
                email,
                password,
                role
            };
        
            if (role === 'Manager' || role === 'Employee') {
                requestPayload.store = store;
            }
        
            await axios.post('https://posbackend-4bid.onrender.com/store/register', requestPayload, {
                headers: {
                    userrole: userrole // Use "userRole" instead of "roles"
                }
            });
         
        
            alert('Employee added successfully');
            navigate('/Register');
        } catch (error) {
            console.log(error);
            alert('Unable to register employee');
        }
        

        setUserName('');
        setEmail('');
        setPassword('');
        setRole('');
        setStore('');
    };

    useEffect(() => {
        axios.get('https://posbackend-4bid.onrender.com/store/Locations')
            .then(response => {
                setStoreList(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <PersonAddAltOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Employee
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="Name"
                                    required
                                    fullWidth
                                    id="Name"
                                    label="Name"
                                    autoFocus
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="role">Role</InputLabel>
                                    <Select
                                        native
                                        label="Role"
                                        name="role"
                                        id="role"
                                        required
                                        inputProps={{
                                            name: 'role',
                                            id: 'role',
                                        }}
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value="Admin">Admin</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Employee">Employee</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleTogglePassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {(role === 'Manager' || role === 'Employee') && (
                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <InputLabel htmlFor="store">Select Store</InputLabel>
                                        <Select
                                            label="Select Store"
                                            name="store"
                                            id="store"
                                            required
                                            value={store}
                                            onChange={(e) => setStore(e.target.value)}
                                        >
                                            {storeList.map((storeOption) => (
                                                <MenuItem
                                                    className="check"
                                                    key={storeOption.storeID}
                                                    value={storeOption.storeID}
                                                >
                                                    {storeOption.address} - {storeOption.city}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </Grid>
                        </Grid>
                      
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add Employee
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
