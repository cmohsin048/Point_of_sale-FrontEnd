import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoggedIn,setUser } from '../reducer/Authslice'
import jwtDecode from 'jwt-decode';
import 'buffer';
import MenuItem from '@mui/material/MenuItem';

import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [store, setStore] = useState('');

  const [storeList, setStoreList] = useState([]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(email, password, role)
    try {
      let loginData = {
        email,
        password,
        role
      };

      if (role === 'Manager' || role === 'Employee') {
        loginData.store = store;
      }

      const response = await axios.post("https://posbackend-4bid.onrender.com/store/login", loginData);
      localStorage.setItem('token', response.data.token);
      alert("Login successful");


      const decodedtoken = jwtDecode(response.data.token);
      const storeID=decodedtoken.store
  
      dispatch(setLoggedIn());
      dispatch(setUser({ storeID: decodedtoken.store }));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('storeID',storeID)

      if (decodedtoken.role === "Admin") {
        navigate('/Admindashboard');
      } else if (decodedtoken.role === "Manager") {
        navigate('/ManagerDashboard');
      } else {
        navigate('/Employeedashboard');
      }


    } catch (error) {
      console.error(error);
      alert("Unable to login", error);
    }

    
    setEmail("");
    setPassword("");
    setRole("");
    setStore("")
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




  // const data = new FormData(event.currentTarget);
  // console.log({
  //   email: data.get('email'),
  //   password: data.get('password'),
  //   role: data.get('role'),
  // });
  const defaultTheme = createTheme();

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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
            <FormControl fullWidth sx={{ mt: 3 }}>
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
            {(role === 'Manager' || role === 'Employee') && (
              <FormControl fullWidth sx={{ mt: 3 }}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
