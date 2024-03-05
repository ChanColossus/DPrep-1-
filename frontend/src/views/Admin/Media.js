import React, { useState, useEffect,Fragment } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getToken } from "../../utils/helpers";
import Select from 'react-select';
import { CircularProgress } from '@mui/material'; 
import { Video,Typography } from '@mui/material';
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

function Infographic() {
  const [tableData, setTableData] = useState({});
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDisasters, setSelectedDisasters] = useState([]);
  const [newMediaData, setNewMediaData] = useState({
    mname: "",
    mvideo: [],
    disasterProne: []
  });
  const [disasters, setDisasters] = useState([]);
  const [dataRefresh, setDataRefresh] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateMediaData, setUpdateMediaData] = useState({
    mname: "",
    mvideo: [],
    disasterProne: []
  });
  const [allDisasters, setAllDisasters] = useState([]);
  const [createErrors, setCreateErrors] = useState({});
  const [updateErrors, setUpdateErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data again
        const mediaResponse = await fetch("http://localhost:4001/api/v1/media");
        if (!mediaResponse.ok) {
          throw new Error(`HTTP error! Status: ${mediaResponse.status}`);
        }
        const mediaData = await mediaResponse.json();
        setTableData(mediaData.media);

        const response = await axios.get("http://localhost:4001/api/v1/disasters");
        setAllDisasters(response.data.disasters);
        // Reset the data refresh state
        console.log("Updated Infographic Data:", updateMediaData);
        setDataRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    if (dataRefresh) {
      fetchData();
    }
  }, [dataRefresh,updateMediaData]);
  console.log(tableData)
  console.log(tableData.media)

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
      setNewMediaData({
        mname: "",
        mvideo: [],
        disasterProne: []
      });
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  };
  const closeModal = () => {
    setCreateErrors({});
    setModalOpen(false);
  };
  const handleVideoChangeCreate = (e) => {
    const files = Array.from(e.target.files);
    setNewMediaData({
      ...newMediaData,
      mvideo: files,
      videoPreviews: files.map((file) => URL.createObjectURL(file)),
    });
  };
  
  const handleFormSubmit = async () => {
    try {
      setIsSubmitting(true);
      const errors = {};
      if (!newMediaData.mname) {
        errors.mname = "Name is required";
      }
      if (newMediaData.disasterProne.length === 0) {
        errors.disasterProne = "Please select at least one disaster";
      }
      if (!Array.isArray(newMediaData.mvideo) || newMediaData.mvideo.length === 0) {  // <-- Error occurs here
        errors.mvideo = "Please select at least one video";
      }
      if (Object.keys(errors).length > 0) {
        setCreateErrors(errors);
        setIsSubmitting(false); 
        return; // Stop form submission if there are errors
      }
    
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
  
      const formData = new FormData();
      formData.append("mname", newMediaData.mname);
  
      newMediaData.disasterProne.forEach((disaster) => {
        formData.append("disasterNames", disaster);
      });
  
      newMediaData.mvideo.forEach((video) => {
        formData.append("mvideo", video);
      });
  
      const response = await axios.post("http://localhost:4001/api/v1/admin/media/new", formData, config);
      setSelectedDisasters([]);

      setDataRefresh(true);
  
      console.log(response.data);
  
      closeModal();
    } catch (error) {

      console.error("Error submitting form:", error);
    }finally{
      setIsSubmitting(false); 
    }
  };

   //UPDATE FUNCTIONS
   const handleUpdateClick = async (row) => {
    setUpdateId(row._id);
    try {
      
      const apiUrl = `http://localhost:4001/api/v1/media/${row._id}`;
      console.log("API URL:", apiUrl);
      const response = await axios.get(apiUrl);
      // Ensure to set the correct keys for updateAreaData
      setUpdateMediaData({
        mname: response.data.media.mname,
        mvideo: response.data.media.mvideo,
        disasterProne: response.data.media.disasterProne.map(disaster => disaster.name),
      });
  
     // This may not reflect the updated state immediately due to closure
      setUpdateModalOpen(true);
      console.log(updateMediaData);
    } catch (error) {
      console.error("Error fetching area data for update:", error);
    }
  };
  
  const closeModalUpdate = () => {
    setUpdateErrors({})
    setUpdateModalOpen(false);
  };
  
// Updated handleVideoChangeUpdate function
const handleVideoChangeUpdate = (e) => {
    const files = Array.from(e.target.files);
    console.log("Files:", files); // Log files array to check the selected files
  
    const videoPreviews = [];
  
    const readAndPreview = (file) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const previewUrl = URL.createObjectURL(file);
         // Create preview URL for the current file
        console.log("Preview URL:", previewUrl); // Log preview URL to check if it's generated correctly
        videoPreviews.push(event.target.result); // Push the preview URL to the array
        console.log("Video Previews:", videoPreviews); // Log videoPreviews array to check the preview URLs
        setUpdateMediaData((prevState) => ({
          ...prevState,
          mvideo: videoPreviews,
          videoPreviews: videoPreviews, // Update videoPreviews with the new array of preview URLs
        }));
      };
  
      reader.readAsDataURL(file);
    };
  
    files.forEach(readAndPreview);
  };
  
  // Updated handleUpdateSubmit function
  const handleUpdateSubmit = async () => {
    const errors = {};
    setIsSubmitting(true);
    if (!updateMediaData.mname) {
      errors.mname = "Name is required";
    }
    if (updateMediaData.disasterProne.length === 0) {
      errors.disasterProne = "Please select at least one disaster";
    }
    if (!Array.isArray(updateMediaData.mvideo) || updateMediaData.mvideo.length === 0) {  // <-- Error occurs here
      errors.mvideo = "Please select at least one video";
    }
    if (Object.keys(errors).length > 0) {
      setUpdateErrors(errors);
      setIsSubmitting(false);
      return; // Stop form submission if there are errors
    }
    try {
      const formData = new FormData();
      formData.append("mname", updateMediaData.mname);
  
      updateMediaData.disasterProne.forEach((disaster) => {
        formData.append("disasterNames", disaster);
      });
  
      if (Array.isArray(updateMediaData.mvideo)) {
        updateMediaData.mvideo.forEach((video, index) => {
          if (video instanceof File) {
            formData.append(`mvideo[${index}]`, video);
          } else if (typeof video === 'string') {
            formData.append(`mvideo[${index}]`, video);
          }
        });
      }
  
      const response = await axios.put(`http://localhost:4001/api/v1/admin/media/${updateId}`, formData);
      console.log(response.data);
  
      closeModalUpdate();
  
      // Auto refresh the page after the modal is closed
      window.location.reload();
    } catch (error) {
      console.error("Error submitting update form:", error);
    } finally{
      setIsSubmitting(false);
    }
  };
  const handleSelectChangeUpdate = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setUpdateMediaData({
      ...updateMediaData,
      disasterProne: selectedValues,
    });
  };
  
  // Filter out existing disasters from the available options
  // Filter out existing disasters from the available options
const availableDisasters = allDisasters.filter(disaster => !updateMediaData.disasterProne.some(selectedDisaster => selectedDisaster.value === disaster.name));

  
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
      const response = await axios.delete(`http://localhost:4001/api/v1/admin/media/${row._id}`, config);

      // Check if the deletion was successful
      if (response.data.success) {
        // Remove the deleted disaster from the state or refresh the data
        setDataRefresh(true); // Assuming you have a state variable to trigger data refresh

        // Log success message
        console.log(response.data.message);
      } else {
        // Handle failure scenario
        console.error("Failed to delete Media:", response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error deleting Media:", error);
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedDisasters = selectedOptions.map(option => option.value);

    // Update newAreaData with selected disasters
    setNewMediaData({
      ...newMediaData,
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
                  Media List{" "}
                  <Button color="primary" className="float-right" onClick={openModal}>
                    New Media
                  </Button>
                </CardTitle>
                <p className="card-category">
                  Videos with learnings.
                </p>
              </CardHeader>
              <Modal isOpen={modalOpen} toggle={closeModal} className="modal-lg">
  <div>
    {isSubmitting && (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
        <CircularProgress />
      </div>
    )}
    <ModalHeader toggle={closeModal}>New Infographic</ModalHeader>
    <ModalBody>
      <Form>
        <FormGroup>
          <Label for="mname">Name</Label>
          <Input
            type="text"
            id="mname"
            value={newMediaData.mname}
            onChange={(e) =>
              setNewMediaData({ ...newMediaData, mname: e.target.value })
            }
          />
          <Typography> {createErrors.mname && <span className="text-danger">{createErrors.mname}</span>}</Typography>
        </FormGroup>
        <FormGroup>
          <Label for="images">Video</Label>
          <Input
            type="file" accept="video/*" onChange={handleVideoChangeCreate} multiple
          />
          <Typography> {createErrors.mvideo && <span className="text-danger">{createErrors.mvideo}</span>}</Typography>
          {newMediaData.videoPreviews &&
            newMediaData.videoPreviews.map((preview, index) => (
              <video key={index} controls width="100" height="auto">
                <source src={preview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ))}
        </FormGroup>
        <Select
          options={Array.isArray(disasters) ? disasters.map(disaster => ({ value: disaster.name, label: disaster.name })) : []}
          value={selectedDisasters.map(disaster => ({ value: disaster, label: disaster }))}
          onChange={handleSelectChange}
          isMulti
        />
        <Typography> {createErrors.disasterProne && <span className="text-danger">{createErrors.disasterProne}</span>}</Typography>
        <Button color="primary" onClick={handleFormSubmit}>
          Submit
        </Button>
      </Form>
    </ModalBody>
  </div>
</Modal>
               
              <Modal isOpen={updateModalOpen} toggle={closeModalUpdate} className="modal-lg">
              <div>
    {isSubmitting && (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
        <CircularProgress />
      </div>
    )}
                <ModalHeader toggle={closeModalUpdate}>Update Area</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="mname">Name</Label>
                      <Input
                        type="text"
                        id="mname"
                        value={updateMediaData.mname}
                        onChange={(e) =>
                          setUpdateMediaData({ ...updateMediaData, mname: e.target.value })
                        }
                      />
                      <Typography> {updateErrors.mname && <span className="text-danger">{updateErrors.mname}</span>}</Typography>
                    </FormGroup> 
                    <FormGroup>
  <Label for="mvideo">Video</Label>
  <Input
    type="file"
    id="mvideo"
    multiple
    onChange={handleVideoChangeUpdate}
    accept="video/*"
  />
  <Typography> {updateErrors.mvideo && <span className="text-danger">{updateErrors.mvideo}</span>}</Typography>
  {updateMediaData.videoPreviews && updateMediaData.videoPreviews.length > 0 ? (
    updateMediaData.videoPreviews.map((preview, index) => (
      <div key={index}>
        <video controls autoPlay muted width="400" height="auto">
          <source src={preview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    ))
  ) : null}
</FormGroup>

                    <FormGroup>
  <Label for="updateDisasters">Disasters</Label>
  <Select
    options={availableDisasters.map(disaster => ({ value: disaster.name, label: disaster.name }))}
    value={updateMediaData.disasterProne.map(disasterName => ({ value: disasterName, label: disasterName }))}
    onChange={handleSelectChangeUpdate}
    isMulti
  />
  <Typography> {updateErrors.disasterProne && <span className="text-danger">{updateErrors.disasterProne}</span>}</Typography>
</FormGroup>
                    <Button color="primary" onClick={handleUpdateSubmit}>
                      Update
                    </Button>
                  </Form>
                </ModalBody>
                </div>
              </Modal>
              <CardBody>
              <Table responsive>
  <thead className="text-primary">
    <tr>
      <th>Video</th>
      <th>Name</th>
      <th>Disasters</th>
    </tr>
  </thead>
  <tbody>
    {dataEntries.map(([key, row], index) => (
      <tr key={index}>
       <td>
  {row.mvideo.length > 0 && (
    <div style={{ width: '40%', overflow: 'hidden' }}>
      <video controls autoPlay muted style={{ maxWidth: '100%', height: 'auto' }}>
        <source src={row.mvideo[0].url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )}
</td>
        <td><strong>{row.mname}</strong></td>
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

export default Infographic;
