import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default function Sales() {
  const [totalSales, setTotalSales] = useState(0);
  
  const storeId = useSelector((state) => state.auth.storeID);
  const jwt = localStorage.getItem('token');
  const decoded = jwtDecode(jwt);
  const userRole = decoded.role;

  const fetchData = async () => {
    try {
      let response;
      if (userRole === 'Admin') {
        response = await axios.get('https://posbackend-4bid.onrender.com/store/getsales');
      } else {
        response = await axios.get(`https://posbackend-4bid.onrender.com/store/Storesales?store=${storeId}`);
      }
  
      
  
      if (Array.isArray(response.data)) {
        const totalAmount = response.data.reduce((acc, sale) => {
          // Calculate the total amount for each sale
          const saleTotal = sale.products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
          return acc + saleTotal;
        }, 0);
  
        setTotalSales(totalAmount);
      } else {
        console.error('Response data is not an array of sales.');
      }
    } catch (error) {
      console.error(error);
      // Handle the error here, e.g., show a message to the user
    }
  };
  
  
  
  
  
  

  useEffect(() => {
    fetchData();
  }, [userRole, storeId]); // Empty dependency array to run once on component mount

  return (
    <React.Fragment>
      <Title>Total Sales</Title>
      <Typography component="p" variant="h4">
        ${totalSales.toFixed(2)}
      </Typography>
    </React.Fragment>
  );
}
