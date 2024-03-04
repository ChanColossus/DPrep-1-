import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authenticate, getUserRole } from "../../utils/helpers";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { UncontrolledAlert } from "reactstrap";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from '../User/getLPTheme';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [mode, setMode] = useState('dark');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({}); 
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

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };
  const login = async () => {
    try {
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
        // Show the success alert
        setTimeout(() => {
          setShowAlert(false); // Hide the success alert after a delay
          const role = getUserRole(); // Get the role from session storage
          if (role === 'admin') {
            navigate("/admin/dashboard"); // Redirect admin to /admin/dashboard
          } else if (role === 'employee') {
            navigate("/employee/dashboard"); // Redirect admin to /admin/dashboard
          } else {
            navigate("/home/user"); // Redirect user to /home/user
          }
        }, 3000); // Hide alert after 3 seconds
      });
    } catch (error) {
      console.error("Invalid user or password", error);
      // Handle login error (e.g., show error message)
    }
  };

  useEffect(() => {
    console.log(showAlert); // Log the updated value of showAlert
  }, [showAlert]);

  return (
  
    <Fragment>
      {/* Show the success alert when isLoggedIn is true */}
      
      <div className="body" style={{ backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Container fluid style={{ paddingTop: "0px" }}>
          <Row>
            {/* Left Column */}
            <Col md="6" className="p-0">
              {/* Slideshow of disaster pictures */}
              <div className="slideshow-container" style={{ width: "100%", height: "100%" }}>
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


<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
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
  <h1 className="mb-3" style={{ color: "black", fontWeight: "bold", textAlign: "center", fontSize: "2rem" }}>Login</h1>
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
  <Button type="submit" style={{ fontWeight: "bold", fontSize: "1rem", color: "white", backgroundColor: "black", marginBottom: "20px" }}>LOGIN</Button>
  <div style={{ display: "flex", flexDirection: "column" }}>
    {/* <Link to="/password/forgot" style={{ color: "#333333", fontWeight: "bold", fontSize: "0.8rem" }}>Forgot Password?</Link> */}
    <Link to="/auth/register" style={{ color: "#333333", fontWeight: "bold", fontSize: "0.8rem" }}>Register</Link>
  </div>
</Form>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>

  );
};

export default Login;
