import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import InfographicCarousel from './InfographicCarousel';
import axios from 'axios';
import { useTheme } from '@mui/material';

export default function Hero() {
  const [infographics, setInfographics] = useState([]);
const theme = useTheme()
  useEffect(() => {
    const fetchInfographics = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/ig");
        setInfographics(response.data.ig);
      } catch (error) {
        console.error("Error fetching infographics:", error);
      }
    };
    fetchInfographics();
  }, []);

  return (
    <Box
      id="hero"
      sx={{
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : 'linear-gradient(#02294F, #090E10)',
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
  <Typography component="h1" variant="h1">
    Be Prepared on Disasters
  </Typography>
  
</Box>
        <Typography variant="body1" textAlign="center" color="text.secondary">
          The Philippines, located in Southeast Asia, is prone to various natural disasters due 
          to its geographical location along the Pacific Ring of Fire and its exposure to typhoons 
          originating from the Pacific Ocean. <br /><br />
          Stay extra prepared for natural disasters by leveraging the resources and information available on this website.
        </Typography>
        <br /><br />
        <InfographicCarousel infographics={infographics} />
      </Container>
    </Box>
  );
}
