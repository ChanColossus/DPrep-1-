import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import getLPTheme from './getLPTheme';
import Carousel from 'react-elastic-carousel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';



const defaultTheme = createTheme({});

const Reports = () => {
    const [showCustomTheme, setShowCustomTheme] = useState(true);
    const [mode, setMode] = useState('dark');
  const LPtheme = createTheme(getLPTheme(mode));
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/v1/reports");
      const data = await response.json();
      // Sort the reports array based on the date property in descending order
      const sortedReports = data.reports.sort((a, b) => new Date(b.date) - new Date(a.date));
      setReports(sortedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
        <Box display="flex" justifyContent="center" p={13} m={2}>
      <Box maxWidth="80%" width="80%">
        <Box textAlign="center">
          <Typography variant="h2" gutterBottom>
            All Reports
          </Typography>
          <Typography variant="h5" gutterBottom align="center" sx={{ fontSize: '1rem' }}>
      "We can't stop natural disasters but we can arm ourselves with knowledge: so many lives wouldn't have to be lost if there was enough disaster preparedness."
    </Typography>
    <br/>
        </Box>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {reports.map((report) => (
            <ListItem
              key={report._id}
              disableGutters
              secondaryAction={
                <IconButton aria-label="comment" onClick={() => handleReportClick(report)}>
                  <CommentIcon /><Typography variant="body2" color="textSecondary">Details</Typography>
                </IconButton>
              }
            >
              <ListItemText primary={`${new Date(report.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${report.disaster.name} - ${report.area.bname}`} />
            </ListItem>
          ))}
        </List>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="transition-modal-title" variant="h6" component="h2" gutterBottom>
                Report Details
              </Typography>
              {selectedReport && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      Date: {new Date(selectedReport.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </Typography>
                    <Typography variant="body1">
                      Area: {selectedReport.area.bname}
                    </Typography>
                    <Typography variant="body1">
                      Disaster: {selectedReport.disaster.name}
                    </Typography>
                    <Typography variant="body1">
                      Affected Persons: {selectedReport.affectedPersons}
                    </Typography>
                    <Typography variant="body1">
                      Casualties: {selectedReport.casualties}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Carousel>
                      {selectedReport.area.bimages.map((images, index) => (
                        <img key={index} src={images.url} alt={`Image ${index}`} style={{ maxWidth: '50%', height: '50%' }} />
                      ))}
                    </Carousel>
                  </Grid>
                </Grid>
              )}
              <Button onClick={handleCloseModal}>Close</Button>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
        </div>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Reports;
