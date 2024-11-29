import { useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import Box from "@mui/material/Box";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const navigate = useNavigate();

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/authentication/sign-in");
  };

  const navLinks = [
    { title: "Projects", path: "/projects" },
    { title: "My Files", path: "/myfiles" },
  ];

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 100px)', // Adjust based on your header height
        pt: 2
      }}>
        <List sx={{ width: '100%' }}>
          {navLinks.map((link, index) => (
            <MDBox mb={2} key={index}>
              <NavLink
                to={link?.path}
                style={{
                  textDecoration: "none",
                  display: "block",
                  padding: "8px 32px",
                }}
              >
                <MDTypography
                  color={textColor}
                  variant="button"
                  fontWeight="medium"
                  textAlign="center"
                  sx={{
                    display: "block",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {link.title}
                </MDTypography>
              </NavLink>
            </MDBox>
          ))}
        </List>

        <Box sx={{ 
          mt: 'auto', 
          mb: 3,
          width: '100%'
        }}>
          <NavLink 
            to="/authentication/sign-in" 
            onClick={handleLogout} 
            style={{ 
              textDecoration: "none",
              display: 'block',
              padding: '8px 32px',
            }}
          >
            <MDTypography 
              color={textColor} 
              variant="button" 
              fontWeight="medium" 
              textAlign="center"
              sx={{ 
                display: 'block',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  color: 'error.main'
                }
              }}
            >
              Logout
            </MDTypography>
          </NavLink>
        </Box>
      </Box>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
