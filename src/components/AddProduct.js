import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import jwtDecode from 'jwt-decode';





const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate()
    const [storeList, setStoreList] = useState([]);
    const [store, setStore] = useState('');
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const [category,setCategory]=useState('')


    const jwt = localStorage.getItem('token');
    const decoded = jwtDecode(jwt)
    const userrole = decoded.role


    const CategoryList = [
        "Fruits & Vegetables",
        "Dairy and Eggs",
        "Bakery",
        "Meat and Seafood",
        "Canned Goods",
        "Dry Goods",
        "Snacks",
        "Beverages",
        "Frozen Foods",
        "Household and Cleaning",
        "Health and Beauty",
        "Baby and Childcare",
        "Pet Supplies",
        "Specialty and Ethnic Foods",
        "Organic and Natural Foods",
        "Baking Supplies",
        "Condiments and Spices",
        "Home and Kitchen",
    ]
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let requestPayload = {
                store: store,
                ProductName: name,
                quantity: quantity,
                description: description,
                Price: price,
                image: image,
                category:category,
            }
            await axios.post('https://posbackend-4bid.onrender.com/store/products/create', requestPayload, {
                headers: {
                    userrole: userrole
                }
            })
            alert("Product was addes successsfully")
            navigate('/Addproduct')
        } catch (error) {
            console.log(error)
            alert("unable to add Product")
        }
        setStore('')
        setQuantity('')
        setPrice('')
        setName('')
        setImage('')
        setDescription('')
        setCategory('')

    };

    useEffect(() => {

        axios.get('http://localhost:3200/store/Locations')
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
                        <InventoryOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add product
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
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

                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="ProductName"
                                    label="Product Name"
                                    name="ProductName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="Quantity"
                                    label="Quantity"
                                    type="Quantity"
                                    id="Quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}


                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="description"
                                    label="description"
                                    type="description"
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="Price"
                                    label="Price"
                                    type="Price"
                                    id="Price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="url"
                                    label="Paste Image URL"
                                    type="url"
                                    id="url"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel htmlFor="store">Select Category</InputLabel>
                                    <Select
                                        label="Select Store"
                                        name="store"
                                        id="store"
                                        required
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {CategoryList.map((category,index) => (
                                            <MenuItem
                                                className="check"
                                                key={index}
                                                value={category}
                                            >
                                                {category} 
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add Product
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}