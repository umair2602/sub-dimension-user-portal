import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from 'notistack';

// Themes & Components
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import Sidenav from "examples/Sidenav";
import routes from "routes";

// Context & Images
import { useMaterialUIController } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Pages
import MyFiles from "layouts/myfiles";
import Profile from "layouts/profile";
import Projects from "layouts/projects";
import CreateProject from "layouts/projects/CreateProject";
import ViewProject from "layouts/projects/ViewProject";

export default function App() {
  const [controller] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Handle sidenav mouse events
  const handleMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setOnMouseEnter(true);
    }
  };

  const handleMouseLeave = () => {
    if (onMouseEnter) {
      setOnMouseEnter(false);
    }
  };

  // Set document direction
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Reset scroll position on route change
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Generate routes
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  return (
    <SnackbarProvider maxSnack={3}>

    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      
      {layout === "dashboard" && (
        <Sidenav
          color={sidenavColor}
          brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
          brandName="My App"
          routes={routes}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}

      <Routes>
        {/* Define explicit routes first */}
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/myfiles" element={<MyFiles />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/create-project" element={<CreateProject />} />
        <Route path="/projects/:id" element={<ViewProject />} />
        {/* Then map any additional routes from your routes config */}
        {getRoutes(routes)}
        
        {/* Redirect root to projects */}
        <Route path="/" element={<Navigate to="/projects" replace />} />
        
        {/* Catch any undefined routes */}
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </ThemeProvider>
    </SnackbarProvider>
  );
}
