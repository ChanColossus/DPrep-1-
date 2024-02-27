import React, { useState, useEffect } from "react";
import { getToken } from "../../utils/helpers";
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


function Report() {
    const [tableData, setTableData] = useState({});
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newReportData, setNewReportData] = useState({
        date: new Date(), // Initialize with the current date
        disaster: null,
        area: null,
        affectedPersons: 0,
        casualties: 0
    });
    const [dataRefresh, setDataRefresh] = useState(true);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [updateReportData, setUpdateReportData] = useState({
        _id: null,
        date: new Date(),
        disaster: null,
        area: null,
        affectedPersons: 0,
        casualties: 0
    });
    const [updateId, setUpdateId] = useState(null);
    const [disasters, setDisasters] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        if (dataRefresh) {
            // Fetch data again
            fetch("http://localhost:4001/api/v1/reports")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => setTableData(data.reports))
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setError(error.message);
                });

            axios.get('http://localhost:4001/api/v1/disasters')
                .then(response => {
                    setDisasters(response.data.disasters);
                })
                .catch(error => {
                    console.error('Error fetching disasters:', error);
                });

            axios.get('http://localhost:4001/api/v1/area')
                .then(response => {
                    setAreas(response.data.area);
                })
                .catch(error => {
                    console.error('Error fetching areas:', error);
                });
            // Reset the data refresh state
            setDataRefresh(false);
        }
    }, [dataRefresh]);
    console.log(tableData)


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
    const openModal = () => {
        setModalOpen(true);
        setNewReportData({
            date: new Date(), // Initialize with the current date
            disaster: null,
            area: null,
            affectedPersons: 0,
            casualties: 0

        });
    };
    const closeModal = () => {
        setModalOpen(false);
    };
    const handleFormSubmit = async () => {
        try {
            const formData = {
                date: newReportData.date,
                disaster: newReportData.disaster,
                area: newReportData.area,
                affectedPersons: newReportData.affectedPersons,
                casualties: newReportData.casualties
            };

            const response = await axios.post("http://localhost:4001/api/v1/admin/report/new", formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            setDataRefresh(true);
            console.log(response.data);
            closeModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    //UPDATE FUNCTIONS
    const handleUpdateClick = (row) => {
        openUpdateModal(row);
    };
    const openUpdateModal = async (row) => {
        if (!row || !row._id) {
            console.error("Invalid row or row id:", row);
            return;
        }
    
        console.log("Row ID:", row._id); // Check if row._id is valid
    
        setUpdateId(row._id, () => {
            console.log("Update ID:", updateId); // Check if updateId is set correctly
        });
        try {
            if (!row || !row._id) {
                console.error("Invalid row or row id:", row);
                return;
            }
            console.log("Fetching old data for ID:", row._id);
            const apiUrl = `http://localhost:4001/api/v1/report/${row._id}`;
            
            console.log("API URL:", apiUrl);
            const response = await axios.get(apiUrl);
            const oldData = response.data.report;
            setUpdateReportData({
                _id: row._id,
                date: oldData.date,
                disaster: oldData.disaster,
                area: oldData.area,
                affectedPersons: oldData.affectedPersons,
                casualties: oldData.casualties,
            });
            console.log(updateReportData)
            
            console.log(updateId)
            setUpdateModalOpen(true);
        } catch (error) {
            console.error("Error fetching old data:", error);
        }
    };

    const closeUpdateModal = () => {
        setUpdateModalOpen(false);
        setUpdateId(null);
    };

    const handleUpdateSubmit = async () => {
        try {
            console.log("Data:",updateReportData)
            const config = {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${getToken()}`,
                },
              };
            const formData = {
                date: updateReportData.date,
                disaster: updateReportData.disaster,
                area: updateReportData.area,
                affectedPersons: updateReportData.affectedPersons,
                casualties: updateReportData.casualties,
            };
            // Send the updated data to the backend server
            const response = await axios.put(`http://localhost:4001/api/v1/admin/report/${updateId}`, 
            formData, config);

            // Refresh the data after update
            setDataRefresh(true);
            console.log(response.data);

            // Close the update modal
            closeUpdateModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    const handleDeleteClick = async (row) => {
        try {
          const config = {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${getToken()}`,
            },
          };

          const response = await axios.delete(`http://localhost:4001/api/v1/admin/report/${row._id}`,config);
          
     
          if (response.data.success) {

            setDataRefresh(true); 

            console.log(response.data.message);
          } else {

            console.error("Failed to delete disaster:", response.data.message);
          }
        } catch (error) {

          console.error("Error deleting disaster:", error);
        }
      };
    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card className="card-plain">
                            <CardHeader>
                                <CardTitle tag="h4">Report List  <Button color="primary" className="float-right" onClick={openModal}>
                                    New Report
                                </Button></CardTitle>
                                <p className="card-category">
                                    Each entry in the list represents a specific disaster report,
                                    detailing crucial information about the incident.
                                </p>
                            </CardHeader>
                            <Modal isOpen={updateModalOpen} toggle={closeUpdateModal} className="modal-lg">
                                <ModalHeader toggle={closeUpdateModal}>Update Report</ModalHeader>
                                <ModalBody>
                                    <Form>
                                        {/* Form inputs for updating report data */}
                                        {/* Example: */}
                                        <FormGroup>
                                            <Label for="date">Date</Label>
                                            <Input
                                                type="date"
                                                id="date"
                                                name="date"
                                                value={updateReportData.date ? new Date(updateReportData.date).toISOString().substr(0, 10) : ''}
                                                onChange={(e) =>
                                                    setUpdateReportData({ ...updateReportData, date: e.target.value })
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="disaster">Disaster</Label>
                                            <Input
                                                type="select"
                                                id="disaster"
                                                name="disaster"
                                                value={updateReportData.disaster}
                                                onChange={(e) =>
                                                    setUpdateReportData({ ...updateReportData, disaster: e.target.value })
                                                }
                                            >
                                                <option value="">Select a disaster</option>
                                                {disasters.map(disaster => (
                                                    <option key={disaster._id} value={disaster._id}>{disaster.name}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="area">Area</Label>
                                            <Input
                                                type="select"
                                                id="area"
                                                name="area"
                                                value={updateReportData.area}
                                                onChange={(e) =>
                                                    setUpdateReportData({ ...updateReportData, area: e.target.value })
                                                }
                                            >
                                                <option value="">Select an area</option>
                                                {areas.map(area => (
                                                    <option key={area._id} value={area._id}>{area.bname}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="affectedPersons">Affected Persons</Label>
                                            <Input
                                                type="number"
                                                id="affectedPersons"
                                                name="affectedPersons"
                                                value={updateReportData.affectedPersons}
                                                onChange={(e) =>
                                                    setUpdateReportData({ ...updateReportData, affectedPersons: e.target.value })
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="casualties">Casualties</Label>
                                            <Input
                                                type="number"
                                                id="casualties"
                                                name="casualties"
                                                value={updateReportData.casualties}
                                                onChange={(e) =>
                                                    setUpdateReportData({ ...updateReportData, casualties: e.target.value })
                                                }
                                            />
                                        </FormGroup>

                                        <Button color="primary" onClick={handleUpdateSubmit}>
                                            Update
                                        </Button>
                                    </Form>
                                </ModalBody>
                            </Modal>
                            <Modal isOpen={modalOpen} toggle={closeModal} className="modal-lg">
                                <ModalHeader toggle={closeModal}>New Report</ModalHeader>
                                <ModalBody>
                                    <Form>
                                        <FormGroup>
                                            <Label for="date">Date</Label>
                                            <Input
                                                type="date"
                                                id="date"
                                                name="date"
                                                value={newReportData.date}
                                                onChange={(e) =>
                                                    setNewReportData({ ...newReportData, date: e.target.value })
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="disaster">Disaster</Label>
                                            <Input
                                                type="select"
                                                id="disaster"
                                                name="disaster"
                                                value={newReportData.disaster}
                                                onChange={(e) =>
                                                    setNewReportData({ ...newReportData, disaster: e.target.value })
                                                }
                                            >
                                                <option value="">Select a disaster</option>
                                                {disasters.map(disaster => (
                                                    <option key={disaster._id} value={disaster._id}>{disaster.name}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="area">Area</Label>
                                            <Input
                                                type="select"
                                                id="area"
                                                name="area"
                                                value={newReportData.area}
                                                onChange={(e) =>
                                                    setNewReportData({ ...newReportData, area: e.target.value })
                                                }
                                            >
                                                <option value="">Select an area</option>
                                                {areas.map(area => (
                                                    <option key={area._id} value={area._id}>{area.bname}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="affectedPersons">Affected Persons</Label>
                                            <Input
                                                type="number"
                                                id="affectedPersons"
                                                name="affectedPersons"
                                                value={newReportData.affectedPersons}
                                                onChange={(e) =>
                                                    setNewReportData({ ...newReportData, affectedPersons: e.target.value })
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="casualties">Casualties</Label>
                                            <Input
                                                type="number"
                                                id="casualties"
                                                name="casualties"
                                                value={newReportData.casualties}
                                                onChange={(e) =>
                                                    setNewReportData({ ...newReportData, casualties: e.target.value })
                                                }
                                            />
                                        </FormGroup>
                                        <Button color="primary" onClick={handleFormSubmit}>
                                            Submit
                                        </Button>
                                    </Form>
                                </ModalBody>
                            </Modal>

                            <CardBody>
                                <Table responsive>
                                    <thead className="text-primary">
                                        <tr>

                                            <th>Date</th>
                                            <th>Disaster Type</th>
                                            <th>Area Affected</th>
                                            <th>No. of Affected</th>
                                            <th>No. of Casualties</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataEntries.map(([key, row], index) => (
                                            <tr key={index}>


                                                <td>{new Date(row.date).toLocaleDateString()}</td>
                                                <td>{row.disaster.name}</td> {/* Display the name of the disaster */}
                                                <td>{row.area.bname}</td> {/* Display the name of the area */}
                                                <td>{row.affectedPersons}</td>
                                                <td>{row.casualties}</td>
                                                <td>

                                                    <Button
                                                        color="info"
                                                        onClick={() => handleUpdateClick(row)}
                                                    >
                                                        Update
                                                    </Button>
                                                </td>
                                                {/* <td>

                                                    <Button
                                                        color="danger"
                                                        onClick={() => handleDeleteClick(row)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td> */}
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

export default Report;
