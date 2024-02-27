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
import Dashboard from "views/Admin/Dashboard.js";
import Disaster from "views/Admin/Disaster.js";
import Area from "views/Admin/Area.js";
import Tool from "views/Admin/Tool.js";
import Report from "views/Admin/Reports.js";
import Quiz from "views/Admin/Quiz.js";
import Infographic from "views/Admin/Infographic.js";
import Media from "views/Admin/Media.js";
import User from "views/Admin/User.js";

import Notifications from "views/Admin/Notifications.js";
import Icons from "views/Admin/Icons.js";
import Typography from "views/Admin/Typography.js";
import TableList from "views/Admin/Tables.js";
import Maps from "views/Admin/Map.js";
import UserPage from "views/Admin/Profile.js";
import UpgradeToPro from "views/Admin/Upgrade.js";

import Login from "views/Authentication/Login.js";

import Register from "views/Authentication/Register.js";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },
  
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-diamond",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "nc-icon nc-pin-3",
  //   component: <Maps />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: <Notifications />,
  //   layout: "/admin",
  // },
  
  // {
  //   path: "/tables",
  //   name: "Table List",
  //   icon: "nc-icon nc-tile-56",
  //   component: <TableList />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-caps-small",
  //   component: <Typography />,
  //   layout: "/admin",
  // },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin",
  },
  {
    path: "/disaster",
    name: "Disaster",
    icon: "nc-icon nc-globe",
    component: <Disaster />,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User",
    icon: "nc-icon nc-globe",
    component: <User />,
    layout: "/admin",
  },
  {
    path: "/area",
    name: "Area",
    icon: "nc-icon nc-globe",
    component: <Area />,
    layout: "/admin",
  },
  {
    path: "/tool",
    name: "Tools",
    icon: "nc-icon nc-globe",
    component: <Tool />,
    layout: "/admin",
  },
  {
    path: "/reports",
    name: "Report",
    icon: "nc-icon nc-globe",
    component: <Report />,
    layout: "/admin",
  },
  {
    path: "/quiz",
    name: "Quiz",
    icon: "nc-icon nc-globe",
    component: <Quiz />,
    layout: "/admin",
  },
  {
    path: "/infographic",
    name: "Infographic",
    icon: "nc-icon nc-globe",
    component: <Infographic />,
    layout: "/admin",
  },
  {
    path: "/media",
    name: "Media",
    icon: "nc-icon nc-globe",
    component: <Media />,
    layout: "/admin",
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
export default routes;
