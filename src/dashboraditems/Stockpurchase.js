import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default function Stockpurchase() {
  const [totalPurchase, setTotalPurchase] = useState(0);
  const storeId = useSelector((state) => state.auth.storeID);
  const jwt = localStorage.getItem('token');
  const decoded = jwtDecode(jwt);
  const userRole = decoded.role;

  const fetchData = async () => {
    try {
      let response;
      if (userRole === 'Admin') {
        response = await axios.get('https://posbackend-4bid.onrender.com/store/getpurchase');
      } else {
        response = await axios.get(`https://posbackend-4bid.onrender.com/store/Storepurchase?store=${storeId}`);
      }



      if (Array.isArray(response.data)) {
        const totalAmount = response.data.reduce((acc, purchase) => acc + purchase.totalAmount, 0);

        setTotalPurchase(totalAmount);
      } else {
        console.error('Response data is not an array of purchases.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Title>Total Purchase</Title>
      <Typography component="p" variant="h4">
        ${totalPurchase.toFixed(2)}
      </Typography>
    </React.Fragment>
  );
}
