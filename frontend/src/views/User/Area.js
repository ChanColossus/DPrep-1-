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

const Area = () => {
  const [mode, setMode] = useState('dark');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const [areas, setArea] = useState([]);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/v1/area');
        setArea(response.data.area);
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
        <Typography variant="h2" gutterBottom align="center">
      Areas
    </Typography>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontSize: '1rem' }}>
      "We can't stop natural disasters but we can arm ourselves with knowledge: so many lives wouldn't have to be lost if there was enough disaster preparedness."
    </Typography>
    <br/>
        <Grid container spacing={3} justifyContent="center">
          {areas.map((area) => (
            <Grid item key={area._id}>
              <Card sx={{ maxWidth: 345 }}>
                <Carousel>
                  {area.bimages.map((image, index) => (
                    <CardMedia
                      key={index}
                      component="img"
                      height="140"
                      image={image.url}
                      alt={`${area.bname} - Image ${index + 1}`}
                    />
                  ))}
                </Carousel>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {area.bname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {area.bdescription}
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

export default Area;
