import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import getLPTheme from './getLPTheme';
import Carousel from 'react-elastic-carousel';

const defaultTheme = createTheme({});

const Disaster = () => {
  const [mode, setMode] = useState('dark');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/v1/disasters');
        setDisasters(response.data.disasters);
      } catch (error) {
        console.error('Error fetching disasters:', error);
      }
    };

    fetchDisasters();
  }, []);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  return (
    <>
      <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CssBaseline />
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <Box p={13} m={2}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontSize: '1rem' }}>
      "We can't stop natural disasters but we can arm ourselves with knowledge: so many lives wouldn't have to be lost if there was enough disaster preparedness."
    </Typography>
        <Grid container spacing={3} justifyContent="center">
          {disasters.map((disaster) => (
            <Grid item key={disaster._id}>
              <Card sx={{ maxWidth: 345 }}>
                <Carousel>
                  {disaster.images.map((image, index) => (
                    <CardMedia
                      key={index}
                      component="img"
                      height="140"
                      image={image.url}
                      alt={`${disaster.name} - Image ${index + 1}`}
                    />
                  ))}
                </Carousel>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {disaster.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {disaster.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
       
        </Box>
        
        </div>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Disaster;
