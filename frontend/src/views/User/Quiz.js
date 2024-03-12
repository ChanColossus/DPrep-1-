import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, MenuItem, Box, Card, Typography, Grid, CardMedia, CardContent, } from '@mui/material';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import getLPTheme from './getLPTheme';
import Input from '@mui/material/Input';
import Carousel from 'react-material-ui-carousel';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


const Quiz = () => {
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const [mode, setMode] = useState('dark');
  const [infographics, setInfographics] = useState([]);

  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({});

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/disasters");
        setDisasters(response.data.disasters);
      } catch (error) {
        console.error('Error fetching disasters:', error);
        setError(error.message);
      }
    };

    fetchDisasters();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/quiz");
        setQuizzes(response.data.quiz);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError(error.message);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchInfographics = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/v1/ig');
        setInfographics(response.data.ig);
      } catch (error) {
        console.error('Error fetching infographics:', error);
        setError(error.message);
      }
    };

    fetchInfographics();
  }, []);

  useEffect(() => {
    const fetchFilteredQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/quiz");
        const fetchedQuizzes = response.data.quiz;
        const filteredQuizzes = selectedDisaster ? fetchedQuizzes.filter(quiz =>
          quiz.disasterProne.some(disaster => disaster.name === selectedDisaster)
        ) : fetchedQuizzes;
        setQuizzes(filteredQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError(error.message);
      }
    };

    fetchFilteredQuizzes();
  }, [selectedDisaster]);

  const handleDisasterSelect = (event) => {
    const selectedDisasterName = event.target.value;
    setSelectedDisaster(selectedDisasterName);
    setSelectedQuizId('');
    setQuizData(null);
  };

  const handleQuizSelect = async (event) => {
    setSelectedQuizId(event.target.value);
    setQuizData(null);

    try {
      const response = await axios.get(`http://localhost:4001/api/v1/quiz/${event.target.value}`);
      setQuizData(response.data.quiz);
      setUserAnswers(new Array(response.data.quiz.QandA.length).fill(''));
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setError(error.message);
    }
  };

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = event.target.value;
    setUserAnswers(newAnswers);
  };

  const handleFinishQuiz = () => {
    let totalScore = 0;
    for (let i = 0; i < quizData.QandA.length; i++) {
      const userAnswerLower = userAnswers[i].toLowerCase();
      const correctAnswerLower = quizData.QandA[i].answer.toLowerCase();
      if (userAnswerLower === correctAnswerLower) {
        totalScore++;
      }
    }
    const numberOfQuestions = quizData.QandA.length;
    const numberOfCorrectAnswers = totalScore;
    const quizScore = (numberOfCorrectAnswers / numberOfQuestions) * 100;

    setScore(quizScore);
    setCorrect(numberOfCorrectAnswers);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    window.location.reload();
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <CssBaseline />
          <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box p={13} m={2}>
                {error ? (
                  <Typography variant="h6" color="error">Error: {error}</Typography>
                ) : (
                  <>
                    <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>Select a Disaster for Quiz</Typography>
                    <Select value={selectedDisaster || ""} onChange={handleDisasterSelect} fullWidth>
                      <MenuItem value="" disabled>Select a Disaster</MenuItem>
                      {disasters.map(disaster => (
                        <MenuItem key={disaster._id} value={disaster.name}>{disaster.name}</MenuItem>
                      ))}
                    </Select>
                    {selectedDisaster && (
                      <>
                        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>Select a Quiz Topic</Typography>
                        <Select value={selectedQuizId || ""} onChange={handleQuizSelect} fullWidth>
                          <MenuItem value="">Select a Quiz</MenuItem>
                          {quizzes.map(quiz => (
                            <MenuItem key={quiz._id} value={quiz._id}>{quiz.qtopic}</MenuItem>
                          ))}
                        </Select>
                        {quizData && (
                          <>
                            <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>{quizData.qname}</Typography>
                            <Box mt={2} p={2} border="1px solid #ccc" borderRadius={5}>
                              <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>"{quizData.qtopic}"</Typography>
                              <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>Note: Answer the quiz with True or False</Typography>
                              <br/>
                              {quizData.QandA.map((question, index) => (
                                <div key={index}>

                                  <Typography variant="h5">{question.question}</Typography>
                                  <Input
                                    type="text"
                                    value={userAnswers[index] || ''}
                                    onChange={(event) => handleAnswerChange(index, event)}
                                    sx={{
                                      border: '1px solid #ccc',
                                      borderRadius: '4px',
                                      backgroundColor: '#fff',
                                      padding: '8px',
                                      width: '100%',
                                      color: 'black' // Set width to 100% of the container
                                    }}
                                  />
                                </div>
                              ))}
                              <Box sx={{ textAlign: 'center' }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleFinishQuiz}
                                  sx={{ mt: 2 }} // Adjust margin top as needed
                                >
                                  Finish Quiz
                                </Button>
                              </Box>
                            </Box>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box p={13} m={2}>
              <Carousel>
            {infographics.map((infographic) => (
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
               
              </Box>
            </Grid>
          </Grid>
          <Modal open={modalOpen} onClose={handleCloseModal}>
  <Card>
    <Box p={2} display="flex" flexDirection="column" >
      <Box alignSelf="flex-end">
        <IconButton onClick={handleCloseModal}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography variant="h3" >Quiz Summary</Typography>
      <br/>
      <Typography variant="h4">Score: {score.toFixed(2)}%</Typography>
      <Typography variant="h5">Number of Correct Answers: {correct}</Typography>
      <br/>
      <Typography variant="h5">Questions</Typography>
      <br/>
      {quizData &&
        quizData.QandA.map((question, index) => (
          <div key={index}>
            <Typography variant="h6">{index + 1}.{question.question}</Typography>
            <br/>
            <Typography variant="h6">
  Your Answer: <span style={{ textDecoration: 'underline' }}>{userAnswers[index]}</span>
</Typography>
<Typography variant="h6">
  Correct Answer: <span style={{ textDecoration: 'underline' }}>{question.answer}</span>
</Typography>
          </div>
        ))}
    </Box>
  </Card>
</Modal>

        </div>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Quiz;
