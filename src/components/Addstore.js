import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import axios from 'axios';
import jwtDecode from 'jwt-decode';



const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate()
    const [storename, setStoreName] = useState('')
    const [storeaddress, setStoreAddress] = useState('')
    const [storecity, setStoreCity] = useState('')
    const [storecountry, setStoreCountry] = useState('')
    const [storephonenumber, setStoreNumber] = useState('')



    const jwt = localStorage.getItem('token');
    const decoded=jwtDecode(jwt)
    const userrole=decoded.role

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let requestPayload = {
                Storename: storename,
                address: storeaddress,
                city: storecity,
                country: storecountry,
                phone: storephonenumber
            }            
            await axios.post('https://posbackend-4bid.onrender.com/store/create', requestPayload,{
                headers: {
                    userrole: userrole 
                }
            })
            alert("store was addes successsfully")
            navigate('/Addstore')
        } catch (error) {
            console.log(error)
            alert("unable to add store")
        }
        setStoreName('')
        setStoreAddress('')
        setStoreCity('')
        setStoreCountry('')
        setStoreNumber('')
    };

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
                        <StorefrontOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Store Location
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="StoreName"
                                    required
                                    fullWidth
                                    id="StoreName"
                                    label="Store Name"
                                    autoFocus
                                    value={storename}
                                    onChange={(e) => setStoreName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="Address"
                                    label="Address"
                                    name="Address"
                                    value={storeaddress}
                                    onChange={(e) => setStoreAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="City"
                                    label="City"
                                    type="City"
                                    id="City"
                                    value={storecity}
                                    onChange={(e) => setStoreCity(e.target.value)}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="Country"
                                    label="Country"
                                    type="Country"
                                    id="Country"
                                    value={storecountry}
                                    onChange={(e) => setStoreCountry(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="Phone"
                                    label="Phone"
                                    type="Phone"
                                    id="Phone"
                                    value={storephonenumber}
                                    onChange={(e) => setStoreNumber(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add Store
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}