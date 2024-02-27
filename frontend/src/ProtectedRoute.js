import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { getUser } from "utils/helpers.js";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const [user, setUser] = useState(getUser());
  console.log(children.type.name);


    if (!user) {
      return <Navigate to="/auth/login" />;
    }
    if (isAdmin === true && user.role !== "admin") {
      return <Navigate to="/auth/login" />;
    }
    return children;

};

export default ProtectedRoute;
