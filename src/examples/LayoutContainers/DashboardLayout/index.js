import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MDBox from "components/MDBox";
import { useMaterialUIController, setLayout, setMiniSidenav } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  // Toggle function for miniSidenav state
  const toggleMiniSidenav = () => {
    setMiniSidenav(dispatch, !miniSidenav);
  };

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",
        marginLeft: miniSidenav ? pxToRem(96) : pxToRem(250), // adjust margin based on sidebar width
        transition: transitions.create(["margin-left"], {
          easing: transitions.easing.easeInOut,
          duration: transitions.duration.standard,
        }),
        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(96) : pxToRem(250),
        },
      })}
    >
      {/* Render the IconButton only when miniSidenav is true (sidebar is collapsed) */}
      {miniSidenav && (
        <IconButton
          onClick={toggleMiniSidenav}
          sx={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 1300,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      {children}
    </MDBox>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
