import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import { Carousel } from 'react-bootstrap';

function User() {
  const [tableData, setTableData] = useState({});
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    age: '',
    gender: '',
    work: '',
    role: '',
    avatar:{}
  });
  const [dataRefresh, setDataRefresh] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    if (dataRefresh) {
      // Fetch data again
      fetch("http://localhost:4001/api/v1/admin/users")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setTableData(data.users))
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message);
        });

      // Reset the data refresh state
      setDataRefresh(false);
    }
  }, [dataRefresh]);
  console.log(tableData)
  console.log(tableData.users)

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
  const openModal = () => {
    setModalOpen(true);
    setNewUserData({
        name: '',
        email: '',
        password: '',
        contact: '',
        age: '',
        gender: '',
        work: '',
        role: '',
        avatar:{}

    });
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const handleImageChangeCreate = (e) => {
    const files = Array.from(e.target.files);
    setNewUserData({
      ...newUserData,
      avatar: files,
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
      formData.append("name", newUserData.name);
      formData.append("email", newUserData.email);
      formData.append("password", newUserData.password);
      formData.append("contact", newUserData.contact);
      formData.append("age", newUserData.age);
      formData.append("work", newUserData.work);
      formData.append("gender", newUserData.gender);
      formData.append("role", newUserData.role);

      newUserData.avatar.forEach((avatar) => {
        formData.append("avatar", avatar);
      });
      const response = await axios.post("http://localhost:4001/api/v1/register", formData,config);
      setDataRefresh(true);

      console.log(response.data);

      closeModal();
    } catch (error) {

      console.error("Error submitting form:", error);
    }
  };
  const handleGenderChange = (e) => {
    setNewUserData({
      ...newUserData,
      gender: e.target.value,
    });
  };
  
  // Handle changes for work
  const handleWorkChange = (e) => {
    setNewUserData({
      ...newUserData,
      work: e.target.value,
    });
  };
  
  // Handle changes for role
  const handleRoleChange = (e) => {
    setNewUserData({
      ...newUserData,
      role: e.target.value,
    });
  };

  const updateUserRoleToEmployee = async (row) => {
    try {
      const response = await axios.put(`http://localhost:4001/api/v1/updateRoleE/${row._id}`);
      console.log(response.data.message);
      window.location.reload();
      // Optionally, you can handle success message or update UI accordingly
    } catch (error) {
      console.error("Error updating user role:", error);
      // Optionally, you can handle error message or update UI accordingly
    }
  };
  const updateUserRoleToUser = async (row) => {
    try {
      const response = await axios.put(`http://localhost:4001/api/v1/updateRoleU/${row._id}`);
      console.log(response.data.message);
      window.location.reload();
      // Optionally, you can handle success message or update UI accordingly
    } catch (error) {
      console.error("Error updating user role:", error);
      // Optionally, you can handle error message or update UI accordingly
    }
  };
  const updateUserRoleToAdmin = async (row) => {
    try {
      const response = await axios.put(`http://localhost:4001/api/v1/updateRoleA/${row._id}`);
      console.log(response.data.message);
      window.location.reload();
      // Optionally, you can handle success message or update UI accordingly
    } catch (error) {
      console.error("Error updating user role:", error);
      // Optionally, you can handle error message or update UI accordingly
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
      // Send a DELETE request to the backend API
      const response = await axios.delete(`http://localhost:4001/api/v1/admin/user/${row._id}`,config);
      
      // Check if the deletion was successful
      if (response.data.success) {
        // Remove the deleted disaster from the state or refresh the data
        setDataRefresh(true); // Assuming you have a state variable to trigger data refresh
        
        // Log success message
        console.log(response.data.message);
      } else {
        // Handle failure scenario
        console.error("Failed to delete disaster:", response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
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
                <CardTitle tag="h4">User List  <Button color="primary" className="float-right" onClick={openModal}>
                  New User
                </Button></CardTitle>
                <p className="card-category">
                 Users Chuchuchu
                </p>
              </CardHeader>
              <Modal isOpen={modalOpen} toggle={closeModal} className="modal-lg">
                <ModalHeader toggle={closeModal}>New User</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        id="name"
                        value={newUserData.name}
                        onChange={(e) =>
                          setNewUserData({ ...newUserData, name: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        type="text"
                        id="email"
                        value={newUserData.email}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            email: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input
                        type="text"
                        id="password"
                        value={newUserData.password}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            password: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="contact">Contact</Label>
                      <Input
                        type="text"
                        id="contact"
                        value={newUserData.contact}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            contact: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="age">Age</Label>
                      <Input
                        type="number"
                        id="age"
                        value={newUserData.age}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            age: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
  <label>Gender</label>
  <Input
    type="select"
    name="gender"
    value={newUserData.gender}
    onChange={handleGenderChange}
  >
    <option value="" disabled selected>Please choose gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Rather Not Say">Rather Not Say</option>
  </Input>
</FormGroup>
<FormGroup>
  <label>Work</label>
  <Input
    type="select"
    name="work"
    value={newUserData.work}
    onChange={handleWorkChange}
  >
    <option value="" disabled selected>Please choose work</option>
    <option value="Student">Student</option>
    <option value="Teacher">Teacher</option>
    <option value="Others">Others</option>
  </Input>
</FormGroup>
<FormGroup>
  <label>Role</label>
  <Input
    type="select"
    name="role"
    value={newUserData.role}
    onChange={handleRoleChange}
  >
    <option value="" disabled selected>Please choose role</option>
    <option value="admin">Admin</option>
    <option value="employee">Employee</option>
    <option value="user">User</option>
  </Input>
</FormGroup>
                    <FormGroup>
                      <Label for="avatar">Avatar</Label>
                      <Input
                        type="file"
                        id="avatar"
                        multiple
                        onChange={handleImageChangeCreate}
                        accept="image/*"
                      />
                      {newUserData.imagePreviews &&
                        newUserData.imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Image ${index + 1}`}
                            style={{ width: "100px", height: "auto", marginRight: "10px" }}
                          />
                        ))}

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
                      <th>Image</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Work</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataEntries.map(([key, row], index) => (
                      <tr key={index}>

                        <td>
                        {row.avatar && typeof row.avatar === 'object' ? (
  <img
    src={row.avatar.url}
    alt={`${row.name}-avatar`}
    style={{ width: '80px', height: '80px' }}
  />
) : (
  <img
    src={row.avatar}
    alt={`${row.name}-avatar`}
    style={{ width: '80px', height: '80px' }}
  />
)}

                        </td>
                        <td>{row.name}</td>
                        <td>{row.email}</td>
                        <td>{row.contact}</td>
                        <td>{row.age}</td>
                        <td>{row.gender}</td>
                        <td>{row.work}</td>
                        <td>{row.role}</td>
                        <td>

                          <Button
                            color="info"
                            onClick={() => updateUserRoleToEmployee(row)}
                          >
                            Employee
                          </Button>
                          
                        </td>
                        <td><Button
                            color="warning"
                            onClick={() => updateUserRoleToUser(row)}
                          >
                            User
                          </Button></td>
                        <td>

                          <Button
                            color="success"
                            onClick={() => updateUserRoleToAdmin(row)}
                          >
                            Admin
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

export default User;
