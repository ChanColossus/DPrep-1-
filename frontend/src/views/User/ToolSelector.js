import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import { FormControl, FormGroup, FormControlLabel, Checkbox, Button, Typography, Modal, Box, Grid } from '@mui/material';
import Footer from './components/Footer';
import getLPTheme from './getLPTheme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from './components/AppAppBar';

const defaultTheme = createTheme({});

const InteractiveTool = () => {
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [tools, setTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState('dark');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const [wrongAnswerMessage, setWrongAnswerMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/v1/disasters');
        setDisasters(response.data.disasters);
      } catch (error) {
        console.error('Error fetching disasters:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/v1/tool');
        setTools(response.data.tool);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };

    if (selectedDisaster) {
      fetchTools();
    }
  }, [selectedDisaster]);

  const handleToolChange = (toolId) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter(id => id !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  };
  const calculateScore = () => {
    // Filter tools based on the selected disaster
    const filteredTools = tools.filter(tool =>
        tool.disasterTool.some(disaster => disaster.name === selectedDisaster)
    );

    // Count the correct answers among the selected tools for the selected disaster
    const correctAnswers = selectedTools.reduce((count, selectedToolId) => {
        if (filteredTools.some(tool => tool._id === selectedToolId)) {
            return count + 1;
        }
        return count;
    }, 0);

    // Calculate the total number of filtered tools
    const numberOfFilteredTools = filteredTools.length;

    // Calculate the number of incorrect answers
    const incorrectAnswers = selectedTools.length - correctAnswers;
    console.log(incorrectAnswers)

    // Deduct points for selecting more wrong answers
    let calculatedCorrectAnswers = correctAnswers;
    if (incorrectAnswers > 0 && correctAnswers > 0) {
        const maxIncorrectDeduction = incorrectAnswers * 0.1;
        calculatedCorrectAnswers = correctAnswers - maxIncorrectDeduction;
    }

    // Calculate the percentage
    let percentage = 0;
    if (numberOfFilteredTools > 0) {
        percentage = (calculatedCorrectAnswers / numberOfFilteredTools) * 100;
    }

    // Update the score state and open the modal
    const calculatedScore = {
        correct: correctAnswers,
        total: numberOfFilteredTools,
        percentage: percentage
    };

    // Determine wrong answer message
    let wrongAnswerMessage = '';
    if (calculatedCorrectAnswers === 0 && selectedTools.length > 0) {
        wrongAnswerMessage = 'All selected answers are wrong.';
    } else if (selectedTools.length > numberOfFilteredTools) {
        wrongAnswerMessage = 'You selected more answers than the correct ones.';
    }

    // Update the score state and open the modal
    setScore(calculatedScore);
    setModalOpen(true);
    setWrongAnswerMessage(wrongAnswerMessage);
};


  const handleCloseModal = () => {
    setModalOpen(false);
    window.location.reload(); // Refresh the page
  };

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  }

  return (
    <>
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CssBaseline />
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <Box border={1} borderRadius={4} p={2} m={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl component="fieldset">
                <Typography variant="h5" gutterBottom>Select a disaster:</Typography>
                <FormGroup>
                  {disasters.map(disaster => (
                    <FormControlLabel
                      key={disaster._id}
                      control={<Checkbox />}
                      label={disaster.name}
                      onChange={() => setSelectedDisaster(disaster.name)}
                      checked={selectedDisaster === disaster.name}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              {selectedDisaster && (
                <FormControl component="fieldset">
                  <Typography variant="h5" gutterBottom>Select tools:</Typography>
                  <FormGroup>
                    {tools.map(tool => (
                      <FormControlLabel
                        key={tool._id}
                        control={<Checkbox />}
                        label={tool.tname}
                        onChange={() => handleToolChange(tool._id)}
                        checked={selectedTools.includes(tool._id)}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              )}
            </Grid>
          </Grid>
          <Button variant="contained" onClick={calculateScore}>Submit</Button>
        </Box>
        <Modal open={modalOpen} onClose={handleCloseModal} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
            {score.percentage !== undefined && (
              <div>
                <Typography variant="h6">Your Score: {score.correct}/{score.total} correct tools</Typography>
                <Typography variant="h6">({score.percentage.toFixed(2)}%)</Typography>
                {(score.correct !== score.total && wrongAnswerMessage !== "All selected answers are wrong.") && (
                  <Typography variant="body1" color="error">You received {score.percentage.toFixed(2)}% but did not select all correct tools.</Typography>
                )}
              </div>
            )}
            {wrongAnswerMessage && wrongAnswerMessage.trim() !== "" && (
              <Typography variant="body1" style={{ color: 'red', marginBottom: '10px' }}>{wrongAnswerMessage}</Typography>
            )}
            <Typography variant="h6">Correct Answers:</Typography>
            <ul>
              {selectedTools.map(toolId => {
                const tool = tools.find(tool => tool._id === toolId);
                if (tool && tool.disasterTool.some(disaster => disaster.name === selectedDisaster)) {
                  return <li key={toolId}>{tool.tname}</li>;
                }
                return null;
              })}
            </ul>
            <Button onClick={handleCloseModal}>Close</Button>
          </Box>
        </Modal>
      </div>
      <Footer />
    </ThemeProvider>
  </>
  );
};

export default InteractiveTool;
