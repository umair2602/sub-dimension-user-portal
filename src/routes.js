import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import MyFiles from "layouts/myfiles";
import PrivateRoute from "components/PrivateRoute";

// @mui icons
import Icon from "@mui/material/Icon";
import FolderIcon from '@mui/icons-material/Folder';

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "My Files",
    key: "myfiles",
    icon: <FolderIcon fontSize="small" />,
    route: "/myfiles",
    component: (
      <PrivateRoute>
        <MyFiles />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
