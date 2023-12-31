import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../dashboraditems/Chart'
import Sales from '../dashboraditems/Sales'
import Stockpurchase from '../dashboraditems/Stockpurchase'
import Epenses from '../dashboraditems/Expenses'
import Typography from '@mui/material/Typography';
import Products from '../Products'
import 'bootstrap/dist/css/bootstrap.min.css';
const defaultTheme = createTheme();

const ManagerDashboard = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            overflow: 'auto',

          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    // height: '100%',
                    borderRadius: 10
                    // Adjust the height as needed
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>


              {/* Recent Deposits */}
              <Grid item xs={3} md={4} lg={3} >
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: 140,
                    marginBottom: 3,
                    borderRadius: 10,
                  }}
                >
                  <Sales />
                </Paper>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: 140,
                    marginBottom: 3,
                    borderRadius: 10,
                  }}
                >
                  <Epenses />
                </Paper>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: 140,
                    borderRadius: 10,

                  }}
                >
                  <Stockpurchase />
                </Paper>

              </Grid>
            </Grid>
            <Products/>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default ManagerDashboard