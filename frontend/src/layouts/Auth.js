import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footer/Footer.js";
import routes from "routes.js";

function AuthDashboard(props) {
  const mainPanel = React.useRef();
  React.useEffect(() => {
    // Scroll to the top when the location changes
    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [props.location]);

  return (
    <div>
      <AuthNavbar {...props} />
      <div ref={mainPanel}>
        {/* Render the routes */}
        <Routes>
          {routes.map((prop, key) => (
            <Route
              path={prop.path}
              element={prop.component}
              key={key}
              exact
            />
          ))}
        </Routes>
        <Footer fluid />
      </div>
    </div>
  );
}

export default AuthDashboard;