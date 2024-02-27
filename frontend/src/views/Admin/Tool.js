import React, { useState, useEffect,Fragment } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getToken } from "../../utils/helpers";
import Select from 'react-select';
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

function Tool() {
  const [tableData, setTableData] = useState({});
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDisasters, setSelectedDisasters] = useState([]);
  const [newToolData, setNewToolData] = useState({
    tname: "",
    tdescription: "",
    timages: [],
    disasterTool: []
  });
  const [disasters, setDisasters] = useState([]);
  const [dataRefresh, setDataRefresh] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateToolData, setUpdateToolData] = useState({
    tname: "",
    tdescription: "",
    timages: [],
    disasterTool: []
  });
  const [allDisasters, setAllDisasters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data again
        const toolResponse = await fetch("http://localhost:4001/api/v1/tool");
        if (!toolResponse.ok) {
          throw new Error(`HTTP error! Status: ${toolResponse.status}`);
        }
        const toolData = await toolResponse.json();
        setTableData(toolData.tool);
        console.log(toolData.tool)

        const response = await axios.get("http://localhost:4001/api/v1/disasters");
        setAllDisasters(response.data.disasters);
        // Reset the data refresh state
        console.log("Updated Area Data:", updateToolData);
        setDataRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    if (dataRefresh) {
      fetchData();
    }
  }, [dataRefresh,updateToolData]);
  console.log(tableData)
  console.log(tableData.tool)

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
      setNewToolData({
        tname: "",
        tdescription: "",
        timages: [],
        disasterTool: []
      });
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const handleImageChangeCreate = (e) => {
    const files = Array.from(e.target.files);
    setNewToolData({
      ...newToolData,
      timages: files,
      imagePreviews: files.map((file) => URL.createObjectURL(file)),
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
      formData.append("tname", newToolData.tname);
      formData.append("tdescription", newToolData.tdescription);


      newToolData.disasterTool.forEach((disaster) => {
        formData.append("disasterNames", disaster);
      });

      newToolData.timages.forEach((image) => {
        formData.append("timages", image);
      });
      console.log(newToolData.disasterTool)
      console.log(newToolData)
      const response = await axios.post("http://localhost:4001/api/v1/admin/tool/new", formData, config);
      setSelectedDisasters([]);
      setDataRefresh(true);

      console.log(response.data);

      closeModal();
    } catch (error) {

      console.error("Error submitting form:", error);
    }
  };

   //UPDATE FUNCTIONS
   const handleUpdateClick = async (row) => {
    setUpdateId(row._id);
    try {
      
      const apiUrl = `http://localhost:4001/api/v1/tool/${row._id}`;
      console.log("API URL:", apiUrl);
      const response = await axios.get(apiUrl);
      // Ensure to set the correct keys for updateAreaData
      setUpdateToolData({
        tname: response.data.tool.tname,
        tdescription: response.data.tool.tdescription,
        timages: response.data.tool.timages,
        disasterTool: response.data.tool.disasterTool.map(disaster => disaster.name),
      });
  
      console.log(updateToolData); // This may not reflect the updated state immediately due to closure
      setUpdateModalOpen(true);
    } catch (error) {
      console.error("Error fetching tool data for update:", error);
    }
  };
  
  const closeModalUpdate = () => {
    setUpdateModalOpen(false);
  };
  
  const handleImageChangeUpdate = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = [];

    const readAndPreview = (file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        imagePreviews.push(event.target.result);
        setUpdateToolData(prevState => ({
          ...prevState,
          timages: imagePreviews,
        }));
      };

      reader.readAsDataURL(file);
    };

    files.forEach(readAndPreview);
};
  
const handleUpdateSubmit = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken()}`,
      },
    };

    const formData = new FormData();
    formData.append("tname", updateToolData.tname);
    formData.append("tdescription", updateToolData.tdescription);

    updateToolData.disasterTool.forEach((disaster) => {
      formData.append("disasterNames", disaster);
    });

    // Check if new images are uploaded
    if (Array.isArray(updateToolData.timages)) {
      updateToolData.timages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`timages[${index}]`, image);
        } else if (typeof image === 'string') {
          formData.append(`timages[${index}]`, image);
        }
      });
    }

    const response = await axios.put(`http://localhost:4001/api/v1/admin/tool/${updateId}`, formData, config);
    setDataRefresh(true);

    console.log(formData)
    console.log(response.data);

    closeModalUpdate();
  } catch (error) {
    console.error("Error submitting update form:", error);
  }
};
  
  const handleSelectChangeUpdate = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setUpdateToolData({
      ...updateToolData,
      disasterTool: selectedValues,
    });
  };
  
  // Filter out existing disasters from the available options
  // Filter out existing disasters from the available options
const availableDisasters = allDisasters.filter(disaster => !updateToolData.disasterTool.some(selectedDisaster => selectedDisaster.value === disaster.name));

  
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
      const response = await axios.delete(`http://localhost:4001/api/v1/admin/tool/${row._id}`, config);

      // Check if the deletion was successful
      if (response.data.success) {
        // Remove the deleted disaster from the state or refresh the data
        setDataRefresh(true); // Assuming you have a state variable to trigger data refresh

        // Log success message
        console.log(response.data.message);
      } else {
        // Handle failure scenario
        console.error("Failed to delete tool:", response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error deleting tool:", error);
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedDisasters = selectedOptions.map(option => option.value);

    // Update newAreaData with selected disasters
    setNewToolData({
      ...newToolData,
      disasterTool: selectedDisasters,
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
                  Tool List{" "}
                  <Button color="primary" className="float-right" onClick={openModal}>
                    New Tool
                  </Button>
                </CardTitle>
                <p className="card-category">
                This tool provides a centralized platform for coordinating various aspects of disaster management, including planning, resource allocation, communication, and data analysis.
                </p>
              </CardHeader>
              <Modal isOpen={modalOpen} toggle={closeModal} className="modal-lg">
                <ModalHeader toggle={closeModal}>New Tool</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="tname">Name</Label>
                      <Input
                        type="text"
                        id="tname"
                        value={newToolData.tname}
                        onChange={(e) =>
                          setNewToolData({ ...newToolData, tname: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="tdescription">Description</Label>
                      <Input
                        type="textarea"
                        id="tdescription"
                        value={newToolData.tdescription}
                        onChange={(e) =>
                          setNewToolData({
                            ...newToolData,
                            tdescription: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="images">Images</Label>
                      <Input
                        type="file"
                        id="images"
                        multiple
                        onChange={handleImageChangeCreate}
                        accept="image/*"
                      />
                      {newToolData.imagePreviews &&
                        newToolData.imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Image ${index + 1}`}
                            style={{ width: "100px", height: "auto", marginRight: "10px" }}
                          />
                        ))}
                    </FormGroup>
                    <Select
                      options={Array.isArray(disasters) ? disasters.map(disaster => ({ value: disaster.name, label: disaster.name })) : []}
                      value={selectedDisasters.map(disaster => ({ value: disaster, label: disaster }))}
                      onChange={handleSelectChange}
                      isMulti
                    />
                    <Button color="primary" onClick={handleFormSubmit}>
                      Submit
                    </Button>
                  </Form>
                </ModalBody>
              </Modal>
              <Modal isOpen={updateModalOpen} toggle={closeModalUpdate} className="modal-lg">
                <ModalHeader toggle={closeModalUpdate}>Update Area</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="tname">Name</Label>
                      <Input
                        type="text"
                        id="tname"
                        value={updateToolData.tname}
                        onChange={(e) =>
                          setUpdateToolData({ ...updateToolData, tname: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="tdescription">Description</Label>
                      <Input
                        type="textarea"
                        id="tdescription"
                        value={updateToolData.tdescription}
                        onChange={(e) =>
                          setUpdateToolData({
                            ...updateToolData,
                            tdescription: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="timages">Images</Label>
                      <Input
                        type="file"
                        id="timages"
                        multiple
                        onChange={handleImageChangeUpdate}
                        accept="image/*"
                      />
                       {
                        updateToolData.timages && updateToolData.timages.length > 0 ? (
                          updateToolData.timages.map((image, index) => (
                            <img
                              key={index}
                              src={typeof image === 'string' ? image : image.url}
                              alt={`Image ${index + 1}`}
                              style={{ width: "100px", height: "auto", marginRight: "10px" }}
                            />
                          ))
                        ) : null
                      }
                    </FormGroup>
                    <FormGroup>
  <Label for="updateDisasters">Disasters</Label>
  <Select
    options={availableDisasters.map(disaster => ({ value: disaster.name, label: disaster.name }))}
    value={updateToolData.disasterTool.map(disasterName => ({ value: disasterName, label: disasterName }))}
    onChange={handleSelectChangeUpdate}
    isMulti
  />
</FormGroup>
                    <Button color="primary" onClick={handleUpdateSubmit}>
                      Update
                    </Button>
                  </Form>
                </ModalBody>
              </Modal> 
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Images</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Disasters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataEntries.map(([key, row], index) => (
                      <tr key={index}>
                        <td>
                          <Carousel {...settings}>
                            {row.timages.map((image, imageIndex) => (
                              <Carousel.Item key={imageIndex}>
                                <img
                                  className="d-block w-100"
                                  src={image.url}
                                  alt={`${row.name}-${imageIndex}`}
                                  style={{ width: '100%', height: '80px' }}
                                />
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        </td>
                        <td>{row.tname}</td>
                        <td style={{ width: '400px', }}>{row.tdescription}</td>
                        <td>
                          {row.disasterTool.map((disaster, index) => (
                            <Fragment key={`disaster-${index}`}>
                              <div style={{ width: '200px', whiteSpace: 'pre-line' }}>
                                {disaster.name}{index !== row.disasterTool.length - 1 ? ',' : ''}
                              </div>
                            </Fragment>
                          ))}
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

export default Tool;
