import React from "react";
import { Navbar, NavbarBrand, Container } from "reactstrap";
import Logo from "logonamin.png"; // Import your logo image here

function AuthNavbar(props) {
  return (
    <Navbar style={{ backgroundImage: "linear-gradient(to right, #00d2ff, #3a7bd5)", color: "#fff", height: "100px" }} >
      <Container>
        <NavbarBrand style={{ marginRight: "auto", display: "flex", alignItems: "center" }}>
          <img src={Logo} alt="Logo" style={{ width: "50px", marginRight: "10px" }} />
        DPrep
        </NavbarBrand>
      </Container>
    </Navbar>
  );
}

export default AuthNavbar;