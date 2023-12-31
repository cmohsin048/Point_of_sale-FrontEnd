import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import jwtDecode from 'jwt-decode';
export default function Chart() {
  const theme = useTheme();
  const [data, setData] = useState([]);

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

      const formattedData = response.data.map((sale, index) => ({
        saleNumber: `Sale ${index + 1}`,
        amount: sale.totalAmount,
      }));

      setData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run once on component mount

  return (
    <React.Fragment>
 
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="saleNumber"
            stroke={theme.palette.text.primary}
            style={{ fontSize: 12 }}
          />
          <YAxis
            stroke={theme.palette.text.primary}
            style={{ fontSize: 12 }}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                fontSize: 12,
              }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
