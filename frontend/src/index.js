import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "views/User/LandingPage.js";
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import ToolSelector from "views/User/ToolSelector.js"
import Disaster from "views/User/Disaster.js"
import Learning from "views/User/Learning.js"
import Area from "views/User/Area.js"
import Predictive from "views/User/Predictive"
import Quiz from "views/User/Quiz.js"
import Tool from "views/User/DisasterTool.js"
import Reports from "views/User/Reports.js"
import AdminLayout from "layouts/Admin.js";
import EmployeeLayout from "layouts/Employee.js";
import AuthLayout from "layouts/Auth.js";
import ProtectedRoute from "ProtectedRoute";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
    <Route path="/home/user" element={<LandingPage />}  />
    <Route path="/home/disaster" element={<Disaster />}  />
    <Route path="/predictive" element={<Predictive />}  />
    <Route path="/home/learning" element={<Learning />}  />
    <Route path="/home/quiz" element={<Quiz />}  />
    <Route path="/home/tool" element={<Tool />}  />
    <Route path="/home/reports" element={<Reports />}  />
    <Route path="/home/area" element={<Area />}  />
    <Route path="/home/toolSelector" element={<ToolSelector />}  />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="/employee/*" element={<ProtectedRoute><EmployeeLayout /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  </BrowserRouter>
);
