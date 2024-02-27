import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { getToken } from "../../utils/helpers";

function User() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    age: '',
    gender: '',
    work: '',
    role: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4001/api/v1/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          }
        });
        setUser(data.user);
        setFormData(prevData => ({
          ...prevData,
          name: data.user.name,
          email: data.user.email,
          contact: data.user.contact,
          password:data.user.password,
          age: data.user.age,
          gender: data.user.gender,
          work: data.user.work,
          role: data.user.role,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const userId = user._id;
    
    const updatedData = { ...formData };

    const config = {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const formDataToUpdate = new FormData();
    Object.keys(updatedData).forEach(key => {
      formDataToUpdate.append(key, updatedData[key]);
    });
    if (avatarFile) {
      formDataToUpdate.append('avatar', avatarFile);
    }

    try {
      await axios.put(`http://localhost:4001/api/v1/me/update/${userId}`, formDataToUpdate, config);
      console.log("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="content">
      {user && (
        <Row>
           <Col md="4">
              <Card className="card-user">
              <div className="image" style={{ backgroundColor: '#007bff' }}>
  {/* Remove the img tag */}
</div>
                <CardBody>
                  <div className="author">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar border-gray"
                        src={user.avatar.url} // Display user avatar from userProfile
                      />
                      <h5 className="title">{user.name}</h5> {/* Display user name from userProfile */}
                    </a>
                    <p className="description">{user.age}</p> {/* Display username from userProfile */}
                  </div>
                  <p className="description text-center">
                    {user.work}
                  </p>
                </CardBody>
              </Card>
            </Col>
          <Col md="8">
            <Card className="card-user">
              <CardHeader>
                <CardTitle tag="h5">Edit Profile</CardTitle>
              </CardHeader>
              <CardBody>
                <Form onSubmit={updateProfile}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Email</label>
                        <Input
                          name="email"
                          value={formData.email}
                          disabled
                          placeholder="Email"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Name</label>
                        <Input
                          name="name"
                          value={formData.name}
                          placeholder="Name"
                          type="text"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Contact</label>
                        <Input
                          name="contact"
                          value={formData.contact}
                          placeholder="Contact"
                          type="number"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Age</label>
                        <Input
                          name="age"
                          value={formData.age}
                          placeholder="Age"
                          type="number"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Gender</label>
                        <Input
                          type="select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Rather not say">Rather not say</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Work</label>
                        <Input
                          type="select"
                          name="work"
                          value={formData.work}
                          onChange={handleInputChange}
                        >
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Others">Others</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Password</label>
                        <Input
                          name="password"
                          value={formData.password}
                          placeholder="Password"
                          type="password"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Role</label>
                        <Input
                          type="select"
                          name="role"
                          value={formData.role}
                          disabled
                          onChange={handleInputChange}
                        >
                          <option value="Admin">Admin</option>
                          <option value="User">User</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Created At</label>
                        <Input
                          name="createdAt"
                          value={user.createdAt}
                          disabled
                          placeholder="Created At"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Avatar</label>
                        <div className="d-flex align-items-center">
                          <Input
                            type="file"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                            id="avatar-input"
                            accept="image/*"
                          />
                          <label htmlFor="avatar-input" className="btn btn-primary mb-0 mr-2">Choose File</label>
                          <div className="position-relative">
                            {avatarFile && (
                              <img
                                src={URL.createObjectURL(avatarFile)}
                                alt="Avatar"
                                className="avatar-preview mr-2 border rounded" // Add border class
                                style={{ width: '100px', height: '100px' }} // Adjust width and height
                              />
                            )}
                            {user.avatar && !avatarFile && (
                              <img
                                src={user.avatar.url}
                                alt="Avatar"
                                className="avatar-preview mr-2 border rounded" // Add border class
                                style={{ width: '100px', height: '100px' }} // Adjust width and height
                              />
                            )}
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" className="text-center">
                      <Button className="btn-round" color="primary" type="submit">
                        Update Profile
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default User;
