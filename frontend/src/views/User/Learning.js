import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import getLPTheme from './getLPTheme';
import Carousel from 'react-elastic-carousel';

const defaultTheme = createTheme({});

const Learning = () => {
  const [mode, setMode] = useState('dark');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const [media, setMedia] = useState([]);
  const [ig, setIg] = useState([]);
  const [disaster, setDisaster] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [filteredIg, setFilteredIg] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);

  const LPtheme = createTheme(getLPTheme(mode));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mediaResponse, igResponse, disasterResponse] = await Promise.all([
          axios.get('http://localhost:4001/api/v1/media'),
          axios.get('http://localhost:4001/api/v1/ig'),
          axios.get('http://localhost:4001/api/v1/disasters')
        ]);
        setMedia(mediaResponse.data.media);
        setFilteredMedia(mediaResponse.data.media);
        setIg(igResponse.data.ig);
        setFilteredIg(igResponse.data.ig);
        setDisaster(disasterResponse.data.disasters);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const handleDisasterChange = (event) => {
    const selectedDisaster = event.target.value;
    setSelectedDisaster(selectedDisaster);
  
    if (selectedDisaster === "") {
      // If "All" is selected, reset filtered arrays to original state
      setFilteredIg(ig);
      setFilteredMedia(media);
    } else {
      // Filter Infographics
      const filteredIg = ig.filter((infographic) => {
        return infographic.disasterProne.some((disaster) => disaster.name === selectedDisaster);
      });
      setFilteredIg(filteredIg);
  
      // Filter Media
      const filteredMedia = media.filter((video) => {
        return video.disasterProne.some((disaster) => disaster.name === selectedDisaster);
      });
      setFilteredMedia(filteredMedia);
    }
  };

  return (
    <>
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box p={16}>
      <Typography variant="h2" gutterBottom align="center">
      Learning Materials
    </Typography>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontSize: '1rem' }}>
      "We can't stop natural disasters but we can arm ourselves with knowledge: so many lives wouldn't have to be lost if there was enough disaster preparedness."
    </Typography>
        <FormControl fullWidth>
          <InputLabel id="disaster-select-label">Select Disaster</InputLabel>
          <Select
  labelId="disaster-select-label"
  id="disaster-select"
  value={selectedDisaster}
  onChange={handleDisasterChange}
>
  <MenuItem value="">All</MenuItem>
  {/* Populate with unique disaster names */}
  {disaster.map((disasterItem) => (
    <MenuItem key={disasterItem.name} value={disasterItem.name}>{disasterItem.name}</MenuItem>
  ))}
</Select>
        </FormControl>
       
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={6}>
        <Typography variant="h2" gutterBottom align="center">
      Infographics
    </Typography>
          <Carousel>
            {filteredIg.map((infographic) => (
              <Card key={infographic._id}>
                <CardMedia
                  component="img"
                  height="700px"
                  maxHeight="100%" // Adjust height here
                  image={infographic.gimages[0].url} // Assuming first image in the array
                  alt={infographic.gname}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {infographic.gname}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </Grid>
        <Grid item xs={6}>
        <Typography variant="h2" gutterBottom align="center">
      Medias
    </Typography>
    <br/>
    <br/>
    <br/>
    <br/>
  
          <Carousel>
            {filteredMedia.map((video) => (
              <Card key={video._id}>
                <CardMedia
                  component="video"
                  maxHeight="100%" // Adjust height here
                  src={video.mvideo[0].url} // Assuming first video in the array
                  controls
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {video.mname}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </Grid>
      </Grid>
      <Footer />
    </ThemeProvider>
  </>
  );
};

export default Learning;
