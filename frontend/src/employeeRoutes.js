/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Employee/Dashboard.js";
import Disaster from "views/Employee/Disaster.js";
import Area from "views/Employee/Area.js";
import Tool from "views/Employee/Tool.js";
import Report from "views/Employee/Reports.js";
import Quiz from "views/Employee/Quiz.js";
import Infographic from "views/Employee/Infographic.js";
import Media from "views/Employee/Media.js";


import Notifications from "views/Admin/Notifications.js";
import Icons from "views/Admin/Icons.js";
import Typography from "views/Admin/Typography.js";
import TableList from "views/Admin/Tables.js";
import Maps from "views/Admin/Map.js";
import UserPage from "views/Employee/Profile.js";
import UpgradeToPro from "views/Admin/Upgrade.js";

import Login from "views/Authentication/Login.js";

import Register from "views/Authentication/Register.js";


var employeeRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/employee",
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/employee",
  },
  {
    path: "/disaster",
    name: "Disaster",
    icon: "nc-icon nc-globe",
    component: <Disaster />,
    layout: "/employee",
  },
  {
    path: "/area",
    name: "Area",
    icon: "nc-icon nc-globe",
    component: <Area />,
    layout: "/employee",
  },
  {
    path: "/tool",
    name: "Tools",
    icon: "nc-icon nc-globe",
    component: <Tool />,
    layout: "/employee",
  },
  {
    path: "/reports",
    name: "Report",
    icon: "nc-icon nc-globe",
    component: <Report />,
    layout: "/employee",
  },
  {
    path: "/quiz",
    name: "Quiz",
    icon: "nc-icon nc-globe",
    component: <Quiz />,
    layout: "/employee",
  },
  {
    path: "/infographic",
    name: "Infographic",
    icon: "nc-icon nc-globe",
    component: <Infographic />,
    layout: "/employee",
  },
  {
    path: "/media",
    name: "Media",
    icon: "nc-icon nc-globe",
    component: <Media />,
    layout: "/employee",
  },
  {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-globe",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "nc-icon nc-globe",
    component: <Register />,
    layout: "/auth",
  },

];
export default employeeRoutes;
