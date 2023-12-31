import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

const defaultTheme = createTheme();

export default function AddExpense() {
   
    const storeId = useSelector((state) => state.auth.storeID);


    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const expenseCategories = ['Bills', 'Salaries', 'Maintenance'];

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const requestPayload = {
                storeID: storeId,
                category: category,
                name: name,
                amount: amount,
            };
            await axios.post('https://posbackend-4bid.onrender.com/store/addexpense', requestPayload, {
                headers: {
                    userrole: 'Admin' 
                }
            });
            alert("Expense was added successfully");
           
        } catch (error) {
            console.error(error);
            alert("Unable to add expense");
        }
        setCategory('');
        setName('');
        setAmount('');
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
                        <AttachMoneyOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Expense
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel htmlFor="category">Select Category</InputLabel>
                                    <Select
                                        label="Select Category"
                                        name="category"
                                        id="category"
                                        required
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {expenseCategories.map((categoryOption) => (
                                            <MenuItem
                                                className="check"
                                                key={categoryOption}
                                                value={categoryOption}
                                            >
                                                {categoryOption}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="Expense Name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="amount"
                                    label="Amount"
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add Expense
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
