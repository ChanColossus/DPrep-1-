import React, { useState, useEffect,Fragment } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getToken } from "../../utils/helpers";
import Select from 'react-select';
import QuizModal from "./QuizModal";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Carousel } from 'react-bootstrap';

function Quiz() {
  const [tableData, setTableData] = useState({});
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDisasters, setSelectedDisasters] = useState([]);
  const [newQuizData, setNewQuizData] = useState({
    qname: "",
    qtopic: "",
    disasterProne: [],
    QandA: []
  });
  const [disasters, setDisasters] = useState([]);
  const [dataRefresh, setDataRefresh] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateQuizData, setUpdateQuizData] = useState({
    qname: "",
    qtopic: "",
    disasterProne: [],
    QandA: []
  });
  const [allDisasters, setAllDisasters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data again
        const quizResponse = await fetch("http://localhost:4001/api/v1/quiz");
        if (!quizResponse.ok) {
          throw new Error(`HTTP error! Status: ${quizResponse.status}`);
        }
        const quizData = await quizResponse.json();
        setTableData(quizData.quiz);

        const response = await axios.get("http://localhost:4001/api/v1/disasters");
        setAllDisasters(response.data.disasters);
        // Reset the data refresh state
        console.log("Updated Quiz Data:", updateQuizData);
        setDataRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    if (dataRefresh) {
      fetchData();
    }
  }, [dataRefresh,updateQuizData]);
  console.log(tableData)
  console.log(tableData.quiz)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1, // Make sure it is spelled correctly
    fade: true,
  };
  if (error) {
    return (
      <div className="content">
        <p>Error loading data. Please check your network connection and try again.</p>
      </div>
    );
  }
  if (typeof tableData !== "object" || tableData === null) {
    console.error("tableData is not an object:", tableData);
    return (
      <div className="content">
        <p>Loading...</p>
      </div>
    );
  }
  const dataEntries = Object.entries(tableData);

  //CREATE FUNCTIONS
  const openModal = async () => {
    try {
      const disastersResponse = await axios.get("http://localhost:4001/api/v1/disasters");
      setDisasters(disastersResponse.data.disasters); // Assuming the response data has a key named 'disasters'
      setModalOpen(true);
      setNewQuizData({
        qname: "",
        qtopic: "",
        disasterProne: [],
        QandA: []
      });
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setNewQuizData({
        qname: "",
        qtopic: "",
        disasterProne: [],
        QandA: [{ question: '', answer: '' }]
      });
  };

  const handleFormSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      console.log(getToken())
      const formData = new FormData();
      formData.append("qname", newQuizData.qname);
      formData.append("qtopic", newQuizData.qtopic);


      newQuizData.disasterProne.forEach((disaster) => {
        formData.append("disasterNames", disaster);
      });
 // Append questions and answers
 newQuizData.QandA.forEach(({ question, answer }, index) => {
    formData.append(`questions[${index}][question]`, question);
    formData.append(`questions[${index}][answer]`, answer);
  });
      
      console.log(newQuizData.disasterProne)
      console.log(newQuizData)
      const response = await axios.post("http://localhost:4001/api/v1/admin/quiz/new", formData, config);
      setSelectedDisasters([]);
      setDataRefresh(true);

      console.log(response.data);

      closeModal();
    } catch (error) {

      console.error("Error submitting form:", error);
    }
  };
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newQandA = [...newQuizData.QandA];
    newQandA[index][name] = value;
    setNewQuizData({ ...newQuizData, QandA: newQandA });
  };

  const handleAddQuestion = () => {
    setNewQuizData({ ...newQuizData, QandA: [...newQuizData.QandA, { question: '', answer: '' }] });
  };

  const handleRemoveQuestion = (index) => {
    const newQandA = [...newQuizData.QandA];
    newQandA.splice(index, 1);
    setNewQuizData({ ...newQuizData, QandA: newQandA });
  };

//    //UPDATE FUNCTIONS
const handleUpdateClick = async (row) => {
    setUpdateId(row._id);
    try {
      const apiUrl = `http://localhost:4001/api/v1/quiz/${row._id}`;
      const response = await axios.get(apiUrl);
  
      // Ensure to set the correct keys for updateQuizData
      setUpdateQuizData({
        qname: response.data.quiz.qname,
        qtopic: response.data.quiz.qtopic,
        disasterProne: response.data.quiz.disasterProne.map(disaster => disaster.name),
        // Set questions and answers
        QandA: response.data.quiz.QandA,
      });
  
      setUpdateModalOpen(true);
    } catch (error) {
      console.error("Error fetching quiz data for update:", error);
    }
  };
    const closeModalUpdate = () => {
    setUpdateModalOpen(false);
  };
  const handleQuestionChange = (index, e) => {
    const newQuestions = [...updateQuizData.QandA];
    newQuestions[index].question = e.target.value;
    setUpdateQuizData(prevState => ({
      ...prevState,
      QandA: newQuestions,
    }));
  };
  
  const handleAnswerChange = (index, e) => {
    const newQuestions = [...updateQuizData.QandA];
    newQuestions[index].answer = e.target.value;
    setUpdateQuizData(prevState => ({
      ...prevState,
      QandA: newQuestions,
    }));
  };
  
  const handleAddQuestionUpdate = () => {
    setUpdateQuizData(prevState => ({
        ...prevState,
        QandA: [...prevState.QandA, { question: '', answer: '' }],
      }));
  };
  const handleRemoveQuestionUpdate = (indexToRemove) => {
    setUpdateQuizData(prevState => ({
      ...prevState,
      QandA: prevState.QandA.filter((qa, index) => index !== indexToRemove),
    }));
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };
  
      const formData = new FormData();
    formData.append("qname", updateQuizData.qname);
    formData.append("qtopic", updateQuizData.qtopic);

    // Append disaster names
    updateQuizData.disasterProne.forEach((disaster) => {
      formData.append("disasterNames", disaster);
    });

    // Append questions and answers
    updateQuizData.QandA.forEach(({ question, answer }, index) => {
      formData.append(`QandA[${index}][question]`, question);
      formData.append(`QandA[${index}][answer]`, answer);
    });
    console.log(formData)
    const response = await axios.put(
      `http://localhost:4001/api/v1/admin/quiz/${updateId}`,
      formData,
      config
    );
    setDataRefresh(true);
  
      console.log(response.data);
  
      closeModalUpdate();
    } catch (error) {
      console.error("Error submitting update form:", error);
    }
  };
  
  const handleSelectChangeUpdate = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setUpdateQuizData({
      ...updateQuizData,
      disasterProne: selectedValues,
    });
  };
const availableDisasters = allDisasters.filter(disaster => !updateQuizData.disasterProne.some(selectedDisaster => selectedDisaster.value === disaster.name));

  
  //DELETE FUNCTION
  const handleDeleteClick = async (row) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      // Send a DELETE request to the backend API
      const response = await axios.delete(`http://localhost:4001/api/v1/admin/quiz/${row._id}`, config);

      // Check if the deletion was successful
      if (response.data.success) {
        // Remove the deleted disaster from the state or refresh the data
        setDataRefresh(true); // Assuming you have a state variable to trigger data refresh

        // Log success message
        console.log(response.data.message);
      } else {
        // Handle failure scenario
        console.error("Failed to delete quiz:", response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error deleting quiz:", error);
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedDisasters = selectedOptions.map(option => option.value);

    // Update newAreaData with selected disasters
    setNewQuizData({
      ...newQuizData,
      disasterProne: selectedDisasters,
    });

    // Update selectedDisasters state
    setSelectedDisasters(selectedDisasters);
  };
  
  return (
    <>

    
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">
                  Quiz List{" "}
                  <Button color="primary" className="float-right" onClick={openModal}>
                    New Quiz
                  </Button>
                </CardTitle>
                <p className="card-category">
                  Quizzes about disasters.
                </p>
              </CardHeader>
              <Modal isOpen={modalOpen} toggle={closeModal} className="modal-lg">
                <ModalHeader toggle={closeModal}>New Area</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="qname">Quiz Name</Label>
                      <Input
                        type="text"
                        id="qname"
                        value={newQuizData.qname}
                        onChange={(e) =>
                          setNewQuizData({ ...newQuizData, qname: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="qtopic">Topic</Label>
                      <Input
                        type="textarea"
                        id="qtopic"
                        value={newQuizData.qtopic}
                        onChange={(e) =>
                          setNewQuizData({
                            ...newQuizData,
                            qtopic: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <Select
                      options={Array.isArray(disasters) ? disasters.map(disaster => ({ value: disaster.name, label: disaster.name })) : []}
                      value={selectedDisasters.map(disaster => ({ value: disaster, label: disaster }))}
                      onChange={handleSelectChange}
                      isMulti
                    />
                     {newQuizData.QandA.map((qna, index) => (
            <div key={index}>
              <FormGroup>
                <Label for={`question-${index}`}>Question</Label>
                <Input
                  type="text"
                  name="question"
                  id={`question-${index}`}
                  value={qna.question}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </FormGroup>
              <FormGroup>
                <Label for={`answer-${index}`}>Answer</Label>
                <Input
                  type="text"
                  name="answer"
                  id={`answer-${index}`}
                  value={qna.answer}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </FormGroup>
              <Button color="danger" onClick={() => handleRemoveQuestion(index)}>Remove</Button>
            </div>
          ))}
          <Button color="primary" onClick={handleAddQuestion}>Add Question</Button>
                    <Button color="primary" onClick={handleFormSubmit}>
                      Submit
                    </Button>
                  </Form>
                </ModalBody>
              </Modal>
              <Modal isOpen={updateModalOpen} toggle={closeModalUpdate} className="modal-lg">
  <ModalHeader toggle={closeModalUpdate}>Update Quiz</ModalHeader>
  <ModalBody>
    <Form>
      <FormGroup>
        <Label for="qname">Quiz Name</Label>
        <Input
          type="text"
          id="qname"
          value={updateQuizData.qname}
          onChange={(e) =>
            setUpdateQuizData({ ...updateQuizData, qname: e.target.value })
          }
        />
      </FormGroup>
      <FormGroup>
        <Label for="qtopic">Topic</Label>
        <Input
          type="textarea"
          id="qtopic"
          value={updateQuizData.qtopic}
          onChange={(e) =>
            setUpdateQuizData({
              ...updateQuizData,
              qtopic: e.target.value,
            })
          }
        />
      </FormGroup>
      <FormGroup>
        <Label for="updateDisasters">Disasters</Label>
        <Select
          options={availableDisasters.map(disaster => ({ value: disaster.name, label: disaster.name }))}
          value={updateQuizData.disasterProne.map(disasterName => ({ value: disasterName, label: disasterName }))}
          onChange={handleSelectChangeUpdate}
          isMulti
        />
      </FormGroup>
      {/* Field for questions and answers */}
      {updateQuizData.QandA.map((qa, index) => (
        <div key={index}>
          <FormGroup>
            <Label for={`question-${index}`}>Question {index + 1}</Label>
            <Input
              type="text"
              name={`question-${index}`}
              value={qa.question}
              onChange={(e) => handleQuestionChange(index, e)}
            />
          </FormGroup>
          <FormGroup>
            <Label for={`answer-${index}`}>Answer {index + 1}</Label>
            <Input
              type="text"
              name={`answer-${index}`}
              value={qa.answer}
              onChange={(e) => handleAnswerChange(index, e)}
            />
          </FormGroup>
          {/* Button to remove question */}
          <Button color="danger" onClick={() => handleRemoveQuestionUpdate(index)}>Remove Question</Button>
        </div>
      ))}
      {/* Button to add new question */}
      <Button color="primary" onClick={handleAddQuestionUpdate}>Add Question</Button>
      <Button color="primary" onClick={handleUpdateSubmit}>Update</Button>
    </Form>
  </ModalBody>
</Modal>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Quiz Name</th>
                      <th>Quiz Topic</th>
                      <th>Disasters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataEntries.map(([key, row], index) => (
                      <tr key={index}>
                        
                        <td>{row.qname}</td>
                        <td style={{ width: '300px', }}>{row.qtopic}</td>
                        <td>
                          {row.disasterProne.map((disaster, index) => (
                            <Fragment key={`disaster-${index}`}>
                              <div style={{ width: '200px', whiteSpace: 'pre-line' }}>
                                {disaster.name}{index !== row.disasterProne.length - 1 ? ',' : ''}
                              </div>
                            </Fragment>
                          ))}
                        </td>
                     
                        <td>
                        <QuizModal quizId={row._id} />
                        </td> 
                        <td>
                          <Button
                            color="info"
                            onClick={() => handleUpdateClick(row)}
                          >
                            Update
                          </Button>
                        </td>
                         <td>
                          <Button
                            color="danger"
                            onClick={() => handleDeleteClick(row)}
                          >
                            Delete
                          </Button>
                        </td> 
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Quiz;
