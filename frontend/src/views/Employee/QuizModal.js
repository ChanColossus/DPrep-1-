import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';

const QuizModal = ({ quizId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [quiz, setQuiz] = useState({
  qname: "",
  qtopic: "",
  disasterProne: [],
  QandA: []});

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/v1/quiz/${quizId}`);
        setQuiz({ qname: response.data.quiz.qname,
            qtopic: response.data.quiz.qtopic,
            disasterProne: response.data.quiz.disasterProne.map(disaster => disaster.name),
            // Set questions and answers
            QandA: response.data.quiz.QandA,});
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };

    if (modalOpen && quizId) {
      fetchQuizDetails();
    }
  }, [modalOpen, quizId]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <Button color="info" onClick={toggleModal}>
        View Details
      </Button>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Quiz Details</ModalHeader>
        <ModalBody>
          {quiz ? (
            <>
              <strong><p>Quiz Name: {quiz.qname}</p></strong>
              <strong><p>Questions and Answers:</p></strong>
              <ul>
                {quiz.QandA && quiz.QandA.map((qa, index) => (
                  <li key={index}>
                    <strong>Question:</strong> {qa.question} <br />
                    <strong>Answer:</strong> {qa.answer}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Loading quiz details...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default QuizModal;
