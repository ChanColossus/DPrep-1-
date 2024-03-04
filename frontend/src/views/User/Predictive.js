import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Button, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import getLPTheme from './getLPTheme';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const defaultTheme = createTheme({});

const PredictiveAnalysis = () => {
    const currentYear = new Date().getFullYear();
  const [mode, setMode] = useState('dark');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [monthlyData, setMonthlyData] = useState({}); // Monthly percentage data for the line graph
  const [areas, setAreas] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [noDataAvailable, setNoDataAvailable] = useState(false); // State to track if no data is available
  const LPtheme = createTheme(getLPTheme(mode));

  useEffect(() => {
    // Fetch areas
    const fetchAreas = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/v1/area');
        setAreas(response.data.area);
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    };

    // Fetch disasters
    const fetchDisasters = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/v1/disasters');
        setDisasters(response.data.disasters);
      } catch (error) {
        console.error('Error fetching disasters:', error);
      }
    };

    // Call the fetch functions
    fetchAreas();
    fetchDisasters();
  }, []);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  const handleDisasterChange = (event) => {
    setSelectedDisaster(event.target.value);
  };

  const handlePredictiveAnalysis = async () => {
    try {
      const response = await axios.get(`http://localhost:4001/api/v1/predictive-analysis/${selectedArea}/${selectedDisaster}`);
      console.log(response.data);

      // Check if response contains the expected data
      if (response.data && response.data.success && response.data.monthlyReports) {
        setMonthlyData(response.data.monthlyReports);
        setNoDataAvailable(false); // Reset noDataAvailable state
      } else {
        setNoDataAvailable(true); // Set noDataAvailable state to true if no data is available
        console.error('Invalid response data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to convert month number to month name
  const getMonthName = (monthNumber) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1];
  };

  return (
    <>
      <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
        <CssBaseline />
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <Box p={16}>
          <Typography variant="h2" gutterBottom align="center">
            Area Disaster Prediction
          </Typography>
          <Typography variant="h5" gutterBottom align="center" sx={{ fontSize: '1rem' }}>
            "We can't stop natural disasters but we can arm ourselves with knowledge: so many lives wouldn't have to be lost if there was enough disaster preparedness."
          </Typography>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" align="center">
                Select Area:
              </Typography>
              <Select value={selectedArea} onChange={handleAreaChange} fullWidth>
                {areas.map((area) => (
                  <MenuItem key={area._id} value={area._id}>
                    {area.bname}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" align="center">
                Select Disaster:
              </Typography>
              <Select value={selectedDisaster} onChange={handleDisasterChange} fullWidth>
                {disasters.map((disaster) => (
                  <MenuItem key={disaster._id} value={disaster._id}>
                    {disaster.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handlePredictiveAnalysis} fullWidth>
                Get Predictive Analysis for year {currentYear + 1}
              </Button>
            </Grid>
          </Grid>
        </Box>
        {Object.keys(monthlyData).length === 0 ? ( // Render if no data is available
        <Typography variant="h6" align="center" sx={{ my: 4 }}>
          No data available for the selected area and disaster.
        </Typography>
      ) : (
        Object.keys(monthlyData).length > 0 && (
            
            <Box px={4} py={2}> {/* Adjust padding to create space around the chart */}
            
            <Line
              data={{
                labels: Object.keys(monthlyData).map(month => getMonthName(parseInt(month.split('-')[1]))), // Convert month numbers to month names
                datasets: [
                  {
                    label: 'Monthly Percentage',
                    data: Object.values(monthlyData),
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 2,
                  },
                ],
              }}
              options={{ // Add options to adjust the size of the chart
                maintainAspectRatio: false, // Allow the chart to not maintain its aspect ratio
                responsive: true, // Allow the chart to be responsive to its container
                height: 200, // Set the height of the chart
              }}
            />
          </Box>
        )
      )}
       {Object.keys(monthlyData).length > 0 && (
  <Card variant="outlined" sx={{ mt: 4 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Graph Details
      </Typography>
      <Typography variant="body1" gutterBottom>
        This graph shows the monthly percentage probability of the selected disaster occurring in the chosen area.
      </Typography>
      <Typography variant="body1" gutterBottom>
        The x-axis represents the months, while the y-axis represents the probability percentage.
      </Typography>
      <Typography variant="body1" gutterBottom>
        By analyzing this graph, we can observe the trend of the disaster probability over time and make informed decisions regarding disaster preparedness measures.
      </Typography>
    </CardContent>
  </Card>
)}

{Object.keys(monthlyData).length > 0 && (
  <Card variant="outlined" sx={{ mt: 4 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Month-by-Month Details
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell align="right">Probability (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(monthlyData).map(([month, probability]) => (
              <TableRow key={month}>
                <TableCell component="th" scope="row">
                  {getMonthName(parseInt(month.split('-')[1]))} {/* Convert month number to month name */}
                </TableCell>
                <TableCell align="right">{probability.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
)}
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default PredictiveAnalysis;
