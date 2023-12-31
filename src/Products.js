import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';
import jwtDecode from 'jwt-decode';

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
];

function Product() {
    const [allProducts, setAllProducts] = useState([]); // Store all products
    const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products
    const [selectedStore, setSelectedStore] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [category, setCategory] = useState(''); // State to store the selected category

    // Obtain user role from JWT
    const jwt = localStorage.getItem('token');
    const decoded = jwtDecode(jwt);
    const storeId = decoded.store;

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        
        // Filter products based on the selected category
        const filtered = allProducts.filter((product) => {
            return selectedCategory ? product.category === selectedCategory : true;
        });
        
        setFilteredProducts(filtered);
    };

    const fetchProducts = (storeID) => {
        let apiUrl = `https://posbackend-4bid.onrender.com/store/Allproducts?store=${storeID}`;
        
        axios
            .get(apiUrl)
            .then((response) => {
                const data = response.data;
                setAllProducts(data);
                
                // Filter products based on the selected category if one is selected
                const filtered = category ? data.filter((product) => product.category === category) : data;
                setFilteredProducts(filtered);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    useEffect(() => {
        // Fetch the list of stores
        axios
            .get('https://posbackend-4bid.onrender.com/store/Locations')
            .then((response) => {
                // console.log('Fetched store locations:', response.data); // Log the fetched store locations
                setStoreList(response.data);
                setUserRole(decoded.role); // Set userRole once the JWT is decoded
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        // Fetch products initially based on user role and store ID
        if (userRole === 'Admin' && selectedStore) {
            fetchProducts(selectedStore);
        } else if (storeId) {
            fetchProducts(storeId);
        }
    }, [selectedStore, userRole, storeId, category]);

    return (
        <section
            style={{
                backgroundColor: '#fff',
                borderRadius: 30,
                marginTop: 30,
            }}
        >
            <div className="text-center container py-5">
                <h4 className="mt-4 mb-5">
                    <strong>Store Products</strong>
                </h4>
                {userRole === 'Admin' && (
                    <FormControl fullWidth sx={{ mt: 3, marginBottom: 10 }}>
                        <InputLabel htmlFor="store">Select Store</InputLabel>
                        <Select
                            label="Select Store"
                            name="store"
                            id="store"
                            required
                            value={selectedStore}
                            onChange={(e)=>setSelectedStore(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Select a store</em>
                            </MenuItem>
                            {storeList.map((storeOption, index) => (
                                <MenuItem
                                    key={index}
                                    value={storeOption.storeID}
                                >
                                    {storeOption.address} - {storeOption.city}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mt: 1, width: 450, marginBottom: 10 }}>
                        <InputLabel htmlFor="category">Select Category</InputLabel>
                        <Select
                            label="Select Category"
                            name="category"
                            id="category"
                            required
                            value={category}
                            onChange={handleCategoryChange}
                        >
                            <MenuItem value="">
                                <em>Select a category</em>
                            </MenuItem>
                            {CategoryList.map((categoryOption, index) => (
                                <MenuItem
                                    className="check"
                                    key={index}
                                    value={categoryOption}
                                >
                                    {categoryOption}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <div className="row">
                    {filteredProducts.length === 0 ? (
                        <div className="col-12 text-center">
                            <p>No products found.</p>
                        </div>
                    ) : (
                        filteredProducts.map((product, index) => (
                            <div className="col-lg-4 col-md-12 mb-4" key={index}>
                                <div className="card" style={{ height: '100%' }}>
                                    <div
                                        className="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                                        data-mdb-ripple-color="light"
                                        style={{
                                            width: '100%',
                                            height: '250px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <img
                                            src={product.image}
                                            className="w-100 h-100"
                                            alt={product.Name}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="card-body" style={{ width: '100%' }}>
                                        <h5 className="card-title mb-3">{product.Name}</h5>
                                        <p>{product.description}</p>
                                        <h6 className="mb-3">${product.price}</h6>
                                        <h6>Category: {product.category}</h6>
                                        <h6>Quantity: {product.quantity}</h6>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default Product;
