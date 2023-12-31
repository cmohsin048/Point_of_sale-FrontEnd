import React, { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

export default function StoreLocations() {
  const [storeLocations, setStoreLocations] = useState([]);

  useEffect(() => {
    fetch('https://posbackend-4bid.onrender.com/store/Locations')
      .then((response) => response.json())
      .then((data) => {
        
        setStoreLocations(data);
      })
      .catch((error) => {
        console.error('Error fetching store locations:', error);
      });
  }, []);

  function preventDefault(event) {
    event.preventDefault();
  }



  return (
    <React.Fragment>
      <Title>Store Locations</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight:"bolder"}}>Store ID</TableCell>
            <TableCell style={{fontWeight:"bolder"}}>Store Name</TableCell>
            <TableCell style={{fontWeight:"bolder"}}>Address</TableCell>
            <TableCell style={{fontWeight:"bolder"}}>City</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {storeLocations.map((store) => (
            <TableRow key={store.storeID}>
              <TableCell>{store.storeID}</TableCell>
              <TableCell>{store.storeName}</TableCell>
              <TableCell>{store.address}</TableCell>
              <TableCell>{store.city}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more store locations
      </Link>
    </React.Fragment>
  );
}
