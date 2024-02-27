import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [work, setWork] = useState("");
  const [avatar, setAvatar] = useState(null);

  const register = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("contact", contact);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("work", work);
      formData.append("avatar", avatar);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        `http://localhost:4001/api/v1/register`,
        formData,
        config
      );
      console.log(data);
      // Redirect to the desired URL after successful registration
      navigate("/auth/login");
    } catch (error) {
      console.error("Error registering user", error);
    }
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  return (
    <Fragment>
      <div className="body" style={{ backgroundColor: "white", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Container className="container-fluid" style={{ paddingTop: "0px" }}>
          <Row className="justify-content-center">
            <Col md="6">
              <Form style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", borderRadius: "20px", padding: "30px", background: "linear-gradient(to right, #85a9db, #00d2ff)" }}>
                <h1 className="mb-3" style={{ color: "#333333", fontWeight: "bold", textAlign: "center", fontSize: "2rem" }}>Register</h1>
                <FormGroup>
                  <Label for="name_field" style={{ color: "#333333", fontWeight: "bold" }}>Name</Label>
                  <Input
                    type="text"
                    id="name_field"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email_field" style={{ color: "#333333", fontWeight: "bold" }}>Email</Label>
                  <Input
                    type="email"
                    id="email_field"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password_field" style={{ color: "#333333", fontWeight: "bold" }}>Password</Label>
                  <Input
                    type="password"
                    id="password_field"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="contact_field" style={{ color: "#333333", fontWeight: "bold" }}>Contact</Label>
                  <Input
                    type="text"
                    id="contact_field"
                    name="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="age_field" style={{ color: "#333333", fontWeight: "bold" }}>Age</Label>
                  <Input
                    type="text"
                    id="age_field"
                    name="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="gender_field" style={{ color: "#333333", fontWeight: "bold" }}>Gender</Label>
                  <Input
                    type="select"
                    id="gender_field"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Rather not say">Rather not say</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="work_field" style={{ color: "#333333", fontWeight: "bold" }}>Work</Label>
                  <Input
                    type="select"
                    id="work_field"
                    name="work"
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  >
                    <option value="">Select Work</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Others">Others</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="avatar_field" style={{ color: "#333333", fontWeight: "bold" }}>Avatar</Label>
                  <Input
                    type="file"
                    id="avatar_field"
                    name="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ fontSize: "1rem" }}
                  />
                </FormGroup>
                <Button onClick={register} className="buttonforRegister" style={{ fontWeight: "bold", fontSize: "1rem", color: "#ffffff", backgroundColor: "#007bff", marginBottom: "20px" }}>REGISTER</Button>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Link to="/auth/login" style={{ color: "#333333", fontWeight: "bold", fontSize: "0.8rem" }}>Already have an account? Login</Link>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default Register;
