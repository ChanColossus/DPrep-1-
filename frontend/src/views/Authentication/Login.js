import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authenticate, getUserRole } from "../../utils/helpers";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { UncontrolledAlert } from "reactstrap";
import { CircularProgress, Typography } from '@mui/material'; 
import logonamin from "Dpreplogo.png"
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authErrors, setAuthErrors] = useState({});

  const images = [
    "https://i.redd.it/pgr88cjsiku01.png",
    "https://thinkingplay.files.wordpress.com/2015/05/house_fire_with_fire_chief.jpg",
    "https://images.pexels.com/photos/823404/pexels-photo-823404.jpeg?cs=srgb&dl=calamity-clouds-dangerous-823404.jpg&fm=jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage === images.length - 1 ? 0 : prevImage + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const login = async () => {
    setIsSubmitting(true);
    try {
      const errors = {};
      if (!email) {
        errors.email = "Email is required";
      }
      if (!password) {
        errors.password = "Password is required";
      }
   
      if (Object.keys(errors).length > 0) {
        setAuthErrors(errors);
        setIsSubmitting(false);
        return; // Stop form submission if there are errors
      }
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `http://localhost:4001/api/v1/login`,
        { email, password },
        config
      );

      // Authenticate user and redirect to dashboard on successful login
      authenticate(data, () => {
        setShowAlert(true);
        setAuthErrors({});
        // Show the success alert
        setTimeout(() => {
          setShowAlert(false); // Hide the success alert after a delay
          const role = getUserRole(); // Get the role from session storage
          if (role === 'admin') {
            setIsSubmitting(false);
            navigate("/admin/dashboard"); // Redirect admin to /admin/dashboard
          } else if (role === 'employee') {
            setIsSubmitting(false);
            navigate("/employee/dashboard"); // Redirect admin to /admin/dashboard
          } else {
            setIsSubmitting(false);
            navigate("/home/user"); // Redirect user to /home/user
          }
        }, 3000); // Hide alert after 3 seconds
      });
    } catch (error) {
      console.error("Invalid user or password", error);
      const errors = {};
      errors.auth = "Invalid username or password";
      setAuthErrors(errors);
      setIsSubmitting(false);
      // Handle login error (e.g., show error message)
    }
  };

  return (
    <Fragment>
      {/* Show the success alert when isLoggedIn is true */}
      <div className="body" style={{ backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Container fluid style={{ paddingTop: "0px" }}>
          <Row>
            {/* Left Column */}
            <Col md="6" className="p-0">
              {/* Slideshow of disaster pictures */}
              <div className="slideshow-container" style={{ maxWidth: "100%", height: "100%" }}>
                <img
                  src={images[currentImage]}
                  alt={`Slide ${currentImage + 1}`}
                  className="slideshow-image"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </Col>
            {/* Right Column */}
            <Col md="6" style={{ background: 'linear-gradient(to right, black, #4e79a7)' }}>
              <div className="login-form-wrapper">
              <div style={{ textAlign: 'center' }}>
      <img
        src={logonamin} // Replace this URL with the URL of your image
        alt="Image above form"
        style={{ width: "50%", height: "auto" }}
      />
    </div>
                {showAlert && (
                  <UncontrolledAlert
                    className="alert-with-icon"
                    color="info"
                    fade={false}
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    <span data-notify="icon" className="nc-icon nc-bell-55" />
                    <span data-notify="message">You have successfully logged in. Redirecting please wait...</span>
                  </UncontrolledAlert>
                )} 
          
             
               
    
               
                
                <Form
                  style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", borderRadius: "20px", padding: "30px", background: "white" }}
                  onSubmit={(e) => { e.preventDefault(); login(); }}
                >
                  <div>
                    {isSubmitting && (
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
                        <CircularProgress />
                      </div>
                    )}
                    <h1 className="mb-3" style={{ color: "black", fontWeight: "bold", textAlign: "center", fontSize: "2rem" }}>Login</h1>
                    <FormGroup>
                      <Label for="email_field" style={{ color: "#333333", fontWeight: "bold" }}>Email</Label>
                      <Input
                        type="email"
                        id="email_field"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value) }
                        style={{ fontSize: "1rem" }}
                      />
                      <Typography> {authErrors.email && <span className="text-danger">{authErrors.email}</span>}</Typography>
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
                      <Typography> {authErrors.password && <span className="text-danger">{authErrors.password}</span>}</Typography>
                    </FormGroup>
                    <Typography> {authErrors.auth && <span className="text-danger">{authErrors.auth}</span>}</Typography>
                    <Button type="submit" style={{ fontWeight: "bold", fontSize: "1rem", color: "white", backgroundColor: "black", marginBottom: "20px" }}>LOGIN</Button>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {/* <Link to="/password/forgot" style={{ color: "#333333", fontWeight: "bold", fontSize: "0.8rem" }}>Forgot Password?</Link> */}
                      <Link to="/auth/register" style={{ color: "#333333", fontWeight: "bold", fontSize: "0.8rem" }}>Register</Link>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default Login;
