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

const DisasterTool = () => {
  const [mode, setMode] = useState('dark');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const [tools, setTool] = useState([]);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/v1/tool');
        setTool(response.data.tool);
      } catch (error) {
        console.error('Error fetching disasters:', error);
      }
    };

    fetchTool();
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
      <div >
        <CssBaseline />
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <Box p={13} m={2}>
        <Typography variant="h2" gutterBottom align="center">
      Disaster Tools
    </Typography>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontSize: '1rem' }}>
      "We can't stop natural disasters but we can arm ourselves with knowledge: so many lives wouldn't have to be lost if there was enough disaster preparedness."
    </Typography>
    <br/>
        <Grid container spacing={3} justifyContent="center">
          {tools.map((tool) => (
            <Grid item key={tool._id}>
              <Card sx={{ maxWidth: 600, width: 300 }}>
                <Carousel>
                  {tool.timages.map((image, index) => (
                    <CardMedia
                      key={index}
                      component="img"
                      height="140"
                      image={image.url}
                      alt={`${tool.tname} - Image ${index + 1}`}
                    />
                  ))}
                </Carousel>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {tool.tname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tool.tdescription}
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

export default DisasterTool;
